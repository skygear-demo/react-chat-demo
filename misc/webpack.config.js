var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    login:  './src/index.login.jsx',
    signup: './src/index.signup.jsx',
    app:    './src/index.app.jsx',
  },
  output: {
    path:     'demo',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'babel',
        query: {presets: ['es2015', 'react']}
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.css$/,
        loader: 'style!css'
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({
      name:     'commons',
      filename: 'commons.js'
    }),
    new HtmlWebpackPlugin({
      title:    'JS Chat Demo',
      filename: 'login.html',
      hash:     true,
      chunks:   ['commons', 'login']
    }),
    new HtmlWebpackPlugin({
      title:    'JS Chat Demo',
      filename: 'signup.html',
      hash:     true,
      chunks:   ['commons', 'signup']
    }),
    new HtmlWebpackPlugin({
      title:    'JS Chat Demo',
      filename: 'app.html',
      hash:     true,
      chunks:   ['commons', 'app']
    }),
    new CopyWebpackPlugin([
      {from: 'img', to: 'img'}
    ]),
  ],
  externals: {
    'react-native': 'undefined',
    'websocket': 'undefined'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  }
}
