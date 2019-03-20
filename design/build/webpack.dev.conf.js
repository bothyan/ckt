var path = require('path');
var webpack = require('webpack');
var merge = require('webpack-merge');
var baseConfig = require('./webpack.base.conf.js');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let argv=process.argv.slice(2),entry='./src/main.js';
argv.forEach(exe=>{
  exe=exe.toString();
  if(exe.indexOf('--env.path=')>-1){
    entry=exe.split('--env.path=')[1];
  }
});

var devConfig = {
  entry: entry,
  output: {
    path: resolve('dist'),
    publicPath: '/dist/',
    filename: 'build.js'
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('../dll/dll.json'),
    })
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
      '/mock/*': {
        target: 'http://localhost:3000',
        secure: false,
        pathRewrite: {'^/mock' : ''}
      }
    },
    public: 'local.chuangkit.com'
    //disableHostCheck: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
};

module.exports = merge(baseConfig, devConfig);
