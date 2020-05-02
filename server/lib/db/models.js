const Sequelize = require('sequelize');

const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const readdirAsync = promisify(fs.readdir);

const MODELS_DIR = path.join(__dirname, 'models');
const SEEDS_DIR = path.join(__dirname, 'seeds');

const sequelize = {
  async init(sql, force = false) {
    try {
      const list = await readdirAsync(MODELS_DIR);
      // Loop through the files in the /models dir and load the models and seeds into js objects
      list.forEach((fn) => {
        const [name] = fn.split('.');
        const model = require(path.join(MODELS_DIR, fn)); // eslint-disable-line
        const seed = require(path.join(SEEDS_DIR, fn)) // eslint-disable-line
        this.models[this.capitalize(name)] = model(sql, Sequelize, this.snake(name));
        this.seeds[this.capitalize(name)] = seed;
      });
      if (force) {
        console.log('\u001b[36m    Synchronizing database\u001b[0m');
        // eslint-disable-next-line
        for (const seed in this.seeds) {
          await this.models[seed].sync({ force: true }); // eslint-disable-line
          // Only populate the development database with seeds
          await this.seeds[seed].insert(this.models[seed]); // eslint-disable-line
        }
      }
    } catch (e) {
      console.error(e);
      console.log('\u001b[31;1mx   Models failed loading, see error above\n\u001b[0m');
    }
  },
  capitalize(model) {
    return `${model.charAt(0).toUpperCase()}${model.slice(1)}`;
  },
  snake(string) {
    return string.replace(/(.+?)([A-Z])/g, (a, b, c) => `${b}_${c.toLowerCase()}`);
  },
  seeds: {},
  models: {},
};

module.exports = sequelize;
