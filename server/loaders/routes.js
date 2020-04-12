const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const readdirAsync = promisify(fs.readdir);

const ROUTES_DIR = path.join(__dirname, '../routes');

const routes = {
  async init(app) {
    try {
      const list = await readdirAsync(ROUTES_DIR);
      // Loop through the files in the ROUTES_DIR and load the .js files into the express app
      list.forEach((fn) => {
        if (!/.js/.test(fn)) return;

        const [name] = fn.split('.');
        const route = require(path.join(ROUTES_DIR, fn)); // eslint-disable-line
        app.use(`/${name}`, route);
        console.log(`✓   Route \`${name}\` has loaded successfully`);
      });
      console.log('✓   Routes config finished loading\n');
    } catch (e) {
      console.error(e);
      console.log('x   Routes failed loading, see error above\n');
    }
  },
};

module.exports = routes;
