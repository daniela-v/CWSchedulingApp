const Sequelize = require('sequelize');
const _ = require('lodash');

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
        this.models[this.capitalize(name)] = model(sql, Sequelize);
        this.seeds[this.capitalize(name)] = seed;
      });
      // Map the table name of each model
      const tables = _.map(this.models, (model) => model.tableName);
      // Synchronize the models with the database
      await sql.sync({
        force,
        searchPath: new RegExp(tables.join('|')),
      });
      if (force) {
        // eslint-disable-next-line
        for (const seed in this.seeds) {
          await this.seeds[seed].insert(this.models[seed]); // eslint-disable-line
        }
      }
    } catch (e) {
      console.log(`${e}`);
    }
  },
  capitalize(model) {
    return `${model.charAt(0).toUpperCase()}${model.slice(1)}`;
  },
  seeds: {},
  models: {},
};

module.exports = sequelize;
