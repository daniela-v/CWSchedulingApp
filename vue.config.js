module.exports = {
  devServer: {
    proxy: {
      '/users': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  chainWebpack(config) {
    config.plugin('html').tap((args) => {
      args[0].title = 'Milestone Manager'; // eslint-disable-line
      return args;
    });
  },
};
