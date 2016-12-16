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
  // Enable line-based sourcemaps
  devtool: 'source-map',
  entry: {
    main: [
      // Install babel-friendly environment
      'babel-polyfill',
      // Include our client source code
      './src/index.js'
      // // Hot middleware
      // 'webpack-dev-server/client?http://localhost:3003',
      // 'webpack-hot-middleware/client?reload=true'
    ]
  },
  module: {
    // Previously named 'loaders'.
    rules: [ {
      exclude: /node_modules/,
      // .babelrc is loaded by default.
      loader: 'babel-loader?cacheDirectory=true!eslint-loader?failOnWarning=false&failOnError=true',
      test: /\.js$/
    }, {
      loader: 'style-loader!css-loader',
      test: /\.css$|\.less$/
    }, {
      loader: 'json-loader',
      test: /\.json/
    }, {
      loader: 'file-loader?name=[name]-[md5:hash].[ext]',
      test: /\.gif$|\.jpg$|\.jpeg$|\.png|\.eot$|\.svg$|\.ttf$|\.woff$|\.woff2$|\.pdf$/ }
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
    // new webpack.LoaderOptionsPlugin({
    //   debug: true
    // }),
    new CopyWebpackPlugin([
      { from: './dev/version.json', to: 'version.json' },
      { from: './dev/config.json', to: 'config.json' }
    ]),
    // Protects against multiple React installs when npm linking
    new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),
    // Enable hot reload
    // new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    // Define constants used throughout the codebase
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    // Build index.html
    new HtmlWebpackPlugin({
      inject: 'body',
      minify: {},
      template: './src/index.html'
    })
  ]
};

module.exports = configuration;
