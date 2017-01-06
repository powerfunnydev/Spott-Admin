const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * The webpack configuration for development.
 *
 * @type {Object}
 */
const configuration = {
  devtool: 'source-map', // Enable line-based sourcemaps
  entry: {
    main: [
      // Install babel-friendly environment
      'babel-polyfill',
      // Include our client source code
      './src/index.js',
      // Hot middleware
      'webpack/hot/dev-server',
      'webpack-dev-server/client?http://localhost:3003'
    ]
  },
  module: {
    loaders: [
      { exclude: /node_modules/, loader: 'babel!eslint?failOnWarning=false&failOnError=false', test: /\.js$/ },
      { loader: 'style!css', test: /\.css$|\.less$/ },
      { loader: 'json', test: /\.json/ },
      { loader: 'file?name=[name]-[md5:hash].[ext]', test: /\.gif$|\.jpg$|\.jpeg$|\.png|\.eot$|\.svg$|\.ttf$|\.woff$|\.woff2$|\.pdf$/ }
    ]
  },
  output: {
    chunkFilename: '[name]-[hash].js',
    filename: '[name]-[hash].js',
    path: path.join(__dirname, 'dist'),
    publicPath: '/'
  },
  devServer: {
    contentBase: './dist',
    port: 3003,
    hot: true
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './dev/version.json', to: 'version.json' },
      { from: './dev/config.json', to: 'config.json' }
    ]),
    // Protects against multiple React installs when npm linking
    new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),
    // Enable hot reload
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // Define constants used throughout the codebase
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // Optimization: remove duplicates
    new webpack.optimize.DedupePlugin(),
    // Optimization: aggressive merging
    new webpack.optimize.AggressiveMergingPlugin(),
    // Optimization: assign the module and chunk ids by occurrence count
    new webpack.optimize.OccurenceOrderPlugin(),
    // Build index.html
    new HtmlWebpackPlugin({
      inject: 'body',
      minify: {},
      template: './src/index.html'
    })
  ]
};

module.exports = configuration;
