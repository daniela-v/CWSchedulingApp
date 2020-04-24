module.exports = {
  devServer: {
    proxy: {
      '/users': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
      '/milestones': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
      '/courseworks': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/scss/_colors.scss";',
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
