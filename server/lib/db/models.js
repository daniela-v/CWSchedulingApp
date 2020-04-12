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
      list.forEach((fn) => {
        const [name] = fn.split('.');
        const model = require(path.join(MODELS_DIR, `${name}.js`)); // eslint-disable-line
        const seed = require(path.join(SEEDS_DIR, `${name}.js`)) // eslint-disable-line
        this.models[name] = model(sql, Sequelize);
        this.seeds[name] = seed;
      });
      const tables = _.map(this.models, (model) => model.tableName);
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
  seeds: {},
  models: {},
};

module.exports = sequelize;
