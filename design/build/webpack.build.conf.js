var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseConfig = require('./webpack.base.conf.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

var devConfig = {
  entry: './src/main.js',
  output: {
    path: resolve('designdist'),
    publicPath: '/designdist/',
    filename: '[name].build.[hash].js'
  },
  plugins: [
    new ExtractTextPlugin('[name].style.[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new HtmlWebpackPlugin({
      filename: 'html/createDesign',
      template: resolve('src/') + 'index.tpl'
    }),
    new HtmlWebpackPlugin({
      filename: 'html/design',
      template: resolve('src/') + 'index.tpl'
    })
  ],
  devtool: '#cheap-hidden-source'
};

module.exports = merge(baseConfig, devConfig);
