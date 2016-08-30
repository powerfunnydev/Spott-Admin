const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * The webpack configuration for production.
 *
 * @type {Object}
 */
const configuration = {
  entry: {
    main: [
      // Install babel-friendly environment
      'babel-polyfill',
      // Include our client source code
      './src/index.js'
    ]
  },
  module: {
    loaders: [
      { exclude: /node_modules/, loader: `strip-loader?strip[]=console.log!babel!eslint?failOnWarning=false&failOnError=false`, test: /\.js$/ },
      { loader: ExtractTextWebpackPlugin.extract('style', 'css'), test: /\.css$/ },
      { loader: 'json', test: /\.json/ },
      { loader: 'file?name=[name]-[md5:hash].[ext]', test: /\.gif$|\.jpg$|\.jpeg$|\.png|\.eot$|\.svg$|\.ttf$|\.woff$|\.woff2$|\.pdf$/ }
    ]
  },
  output: {
    chunkFilename: '[name]-[chunkhash].js',
    filename: '[name]-[chunkhash].js',
    path: path.join(__dirname, 'dist')
  },
  plugins: [
    // Protects against multiple React installs when npm linking
    new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),
    new webpack.NormalModuleReplacementPlugin(/^react(\/addons)?$/, require.resolve('react/addons')),
    // In production we write css to its own file
    new ExtractTextWebpackPlugin('[name]-[chunkhash].css'),
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
    // Optimization: in production we minify
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      output: {
        comments: false,
        max_line_len: 0 // eslint-disable-line camelcase
      }
    }),
    // Build index.html
    new HtmlWebpackPlugin({
      inject: 'body',
      minify: {},
      template: './src/index.html'
    })
  ],
  progress: true
};

module.exports = configuration;
