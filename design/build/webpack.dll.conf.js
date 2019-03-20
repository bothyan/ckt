const webpack = require('webpack');
const path = require('path');
const dlls = [
  'vue',
  'vue-router',
  'vuex'
];

module.exports = {
  devtool: '#source-map',
  output: {
    path: path.resolve(__dirname, '../dll'),
    filename: '[name].js',
    library: '[name]'
  },
  entry: {
    dll: dlls
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.js'
    }
  },
  plugins: [
    new webpack.DllPlugin({
      path: './dll/dll.json',
      name: '[name]',
      context: __dirname
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      expect: ['$', 'exports', 'require']
    })
  ],
};
