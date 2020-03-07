const knex = require("./knex.js");

const users = {
  async register() {
    // Dummy block
    let select = await knex("tableName").select();
    return select;
  },
  async authenticate() {
    throw "Empty block";
  },
  async deauthenticate() {
    throw "Empty block";
  }
};

module.exports = users;
