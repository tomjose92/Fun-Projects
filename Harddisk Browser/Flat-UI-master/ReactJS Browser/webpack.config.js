var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/client/public');
var APP_DIR = path.resolve(__dirname, 'src/client/app');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      selectors: '../selectors/selectors',
      services: '../services/services',
      utils: '../utils/utils'
    },
    extensions: ['', '.js', '.jsx', '.json']
  },
  module : {
    loaders : [
      {
        test : /\.jsx?$/,
        include : APP_DIR,
        exclude:/node_modules/,
        loaders: ["react-hot", "babel-loader"]
      }
    ]
  }
};

module.exports = config;