const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractHTML = new ExtractTextPlugin('[name].html');
const stringify = require('webpack-stringify-loaders');

module.exports = {
  entry: {
    index: './src/js/index.js',
  },

  output: {
    path: __dirname + '/publish',
    filename: './js/[name].js',
  },

  module: {
    loaders: [{
      test: /\.tag\.pug$/,
      exclude: /node_modules/,
      loader: stringify([{
        loader: 'riotjs',
      }, {
        loader: 'pug-html',
        query: {
          pretty: true,
          exports: false,
          plugins: ['pug-plugin-no-yield'],
        },
      }]),
    }, {
      test: /\.html\.pug$/,
      exclude: /node_modules/,
      loader: extractHTML.extract(stringify([{
        loader: 'pug-html',
        query: {
          pretty: true,
          plugins: ['pug-plugin-no-yield'],
        },
      }])),
    }]
  },

  plugins: [
    extractHTML,
    new webpack.ProvidePlugin({
      riot: 'riot'
    }),
  ],
}
