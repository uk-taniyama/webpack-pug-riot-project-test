const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractHTML = new ExtractTextPlugin('[name].html');
const stringify = require('webpack-stringify-loaders');
const customLoader = require('custom-loader');
const riot = require('riot-compiler');
const utils = require('loader-utils');

customLoader.loaders.riot = function(source) {
  const query = utils.parseQuery(this.query);
  return riot.compile(source, query.options || {});
};
customLoader.loaders.dummy = function(source) {
  "version,context,request,query,data,cacheable,loaders,loaderIndex,resource,resourcePath,resourceQuery,value,inputValue,options,debug,minimize,sourceMap,target,webpack".split(",").forEach((name) => {
    console.log(name, this[name]);
  });
  "ext,name,path,folder".split(",").forEach((name) => {
    var value = utils.interpolateName(this, `[${name}]`, {context: this.options.context});
    console.log(name, value);
  });
  return source;
};

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
        loader: 'custom',
        query: {
          name: 'riot',
        },
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
