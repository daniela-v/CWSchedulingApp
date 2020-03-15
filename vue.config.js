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
};
