const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractHTML = new ExtractTextPlugin('[name].html');
const querystring = require('querystring');

// stringify loaders configuration.
function stringify(loaders) {
  if(!loaders){
    return;
  }
  if(typeof loaders==='string'){
    return;
  }
  if(!Array.isArray(loaders)){
    loaders = [loaders];
  }
  return loaders.map((loader) => {
    if(typeof loader==='string'){
      return loader;
    }
    if(!loader.query){
      return loader.loader;
    }
    return loader.loader + '?' + querystring.stringify(loader.query);
  }).join('!');
}

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
          plugins: 'pug-plugin-no-yield',
        },
      }]),
    }, {
      test: /\.html\.pug$/,
      exclude: /node_modules/,
      loader: extractHTML.extract(stringify({
        loader: 'pug-html',
        query: {
          pretty: true,
          plugins: 'pug-plugin-no-yield',
        },
      })),
    }]
  },

  plugins: [
    extractHTML,
    new webpack.ProvidePlugin({
      riot: 'riot'
    }),
  ],
}
