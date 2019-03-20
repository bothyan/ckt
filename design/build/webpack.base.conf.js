var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

var baseConfig = {
  resolve: {
    // 引用js,vue,json时不用加后缀
    extensions: ['.js', '.vue', '.json'],
    // 常用位置别名
    alias: {
      'vue$': 'vue/dist/vue.common.js', // 基于 CommonJS 的完整构建
      'config': resolve('config'),
      'base': resolve('src/base'),
      'pages': resolve('src/pages'),
      'widgets': resolve('src/widgets'),
      'layout': resolve('src/layout'),
      'components': resolve('src/components'),
      'lib': resolve('src/lib'),
      'common': resolve('src/common'),
      'dataBus': resolve('src/dataBus')
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: {
            loaders: {
              css: ExtractTextPlugin.extract({
                use: 'css-loader',
                fallback: 'vue-style-loader'
              }),
              less: ExtractTextPlugin.extract({
                use: 'css-loader!less-loader',
              })
            }
          }
        }
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]'
          }
        }
      },
      {
        test: /\.(ttf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
        }
      }
    ]
  },
  devtool: '#eval-source-map'
};

module.exports = baseConfig;
