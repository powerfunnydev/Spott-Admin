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
  // Offers SourceMaps that only maps lines (no column mappings).
  // Much faster as using 'source-map'. Increases the main file size.
  devtool: 'source-map', // TODO: eval-cheap-module-source-map
  entry: {
    main: [
      // Install babel-friendly environment
      'babel-polyfill',
      // Hot reloading for React.
      // 'webpack-dev-server/client?http://0.0.0.0:3003', // WebpackDevServer host and port
      // 'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors.
      // Include our client source code
      './src/index.js'
    ]
  },
  module: {
    // Previously named 'loaders'.
    rules: [ {
      exclude: /node_modules/,
      // .babelrc is loaded by default.
      // We don't use react-hot-loader here, because it should be declared in
      // the .babelrc file.
      use: [ {
        loader: 'babel-loader',
        options: {
          // Use caching.
          cacheDirectory: true
        }
      }, {
        loader: 'eslint-loader',
        options: {
          // Use cache for speedup.
          // Disable cache because there is a bug in eslint.
          // Cache is not invalidated if the .eslintrc file was changed.
          // cache: true,
          failOnWarning: false,
          failOnError: false
        }
      } ],
      test: /\.js$/
    }, {
      use: [
        'style-loader',
        'css-loader'
      ],
      test: /\.css$|\.less$/
    }, {
      use: 'json-loader',
      test: /\.json/
    }, {
      query: {
        name: '[name]-[md5:hash].[ext]'
      },
      use: 'file-loader',
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
    // HotModuleReplacementPlugin is enabled with the --hot flag.

    // Prints more readable module names in the browser console on HMR updates.
    new webpack.NamedModulesPlugin(),

    new CopyWebpackPlugin([
      { from: './dev/version.json', to: 'version.json' },
      { from: './dev/config.json', to: 'config.json' }
    ]),
    // Protects against multiple React installs when npm linking
    new webpack.NormalModuleReplacementPlugin(/^react?$/, require.resolve('react')),

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
