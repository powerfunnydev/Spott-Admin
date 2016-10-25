const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

/**
 * The webpack configuration for development.
 *
 * @type {Object}
 */
const configuration = function (config) {
  config.set({
    basePath: '',
    frameworks: [ 'jasmine' ],
    files: [
      'test/**/*.js'
    ],

    preprocessors: {
      // add webpack as preprocessor
      'src/**/*.js': [ 'webpack', 'sourcemap' ],
      'test/**/*.js': [ 'webpack', 'sourcemap' ]
    },

    webpack: {
      devtool: 'source-map', // Enable line-based sourcemaps
      entry: {
        main: [
          // Install babel-friendly environment
          'babel-polyfill',
          // Include our client source code
          './src/index.js',
          // Hot middleware
          'webpack-dev-server/client?http://localhost:3003',
          'webpack-hot-middleware/client?reload=true'
        ]
      },
      externals: {
        cheerio: 'window',
        'react/addons': true,
        'react/lib/ExecutionEnvironment': true,
        'react/lib/ReactContext': true
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
    },
    webpackServer: {
      noInfo: true, // please don't spam the console when running in karma!
      stats: {
        chunks: false
      }
    },

    plugins: [
      'karma-mocha-reporter',
      'karma-webpack',
      'karma-jasmine',
      'karma-sourcemap-loader',
      'karma-chrome-launcher',
      'karma-phantomjs-launcher'
    ],

    reporters: [ 'mocha' ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: [ 'Chrome' ],
    singleRun: false

  });
};

module.exports = configuration;
