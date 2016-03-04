require('source-map-support/register');

// Install babel
require('babel-core/register');
require('babel-polyfill');

// Install jsdom. Then copy everything on global.window to global itself, making it
// available without a 'window.' prefix.
global.document = require('jsdom').jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
Object.keys(global.window).forEach((key) => {
  if (!(key in global)) {
    global[key] = global.window[key];
  }
});

// Initialize API endpoint
require('../src/api/_request').setBaseUrl(require('../src/config.json').api);
