import httpinvoke from 'httpinvoke';

// we retrieve the urls from the configuration file, which is retrieved from the server.
let API_URL;
let APPTVATE_WEBSITE_URL;
let CMS_URL;
let CMS_NEXT_URL;
let TAGGER_URL;

export function setBaseUrls (baseUrls) {
  // Trim trailing slashes
  API_URL = baseUrls.api.replace(/\/$/g, '');
  APPTVATE_WEBSITE_URL = baseUrls.apptvateWebsite.replace(/\/$/g, '');
  CMS_URL = baseUrls.cms.replace(/\/$/g, '');
  CMS_NEXT_URL = baseUrls.cmsNext.replace(/\/$/g, '');
  TAGGER_URL = baseUrls.tagger.replace(/\/$/g, '');
}

// httpinvoke, our father
// ----------------------

function tryToParseJson (text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
}

// Hooking a finished hook into httpinvoke creates a new httpinvoke. The given callback is executed
// upon each processed request. The callback has the power to manipulate the arguments seen by the
// rest of the appication.
const hookedHttpinvoke = httpinvoke.hook('finished', function (err, output, statusCode, headers) {
  if (err) { return arguments; }
  // Convert 400's and 500's to error
  if (statusCode >= 400 && statusCode <= 599) {
    const newOutput = tryToParseJson(output);
    return [ { body: newOutput, statusCode }, newOutput, statusCode, headers ];
  }
  return [ err, tryToParseJson(output), statusCode, headers ];
});

// Internal helpers
// ----------------

const CONVERTERS = {
  'json text': JSON.stringify,
  'text json': (identity) => identity
};

function optionsWithoutBody (authenticationToken) {
  return {
    converters: CONVERTERS,
    headers: { // Request headers
      authtoken: authenticationToken
    },
    outputType: 'json'
  };
}

function optionsWithBody (authenticationToken, body) {
  return {
    converters: CONVERTERS,
    headers: { // Request headers
      'Content-Type': 'application/json',
      authtoken: authenticationToken
    },
    input: body || {},
    inputType: 'json', // Type of request data
    outputType: 'json' // Type of response body
  };
}

function optionsWithBodyForFormData (authenticationToken, body) {
  return {
    converters: CONVERTERS,
    headers: { // Request headers
      authtoken: authenticationToken
    },
    inputType: 'formdata', // type of request data
    outputType: 'text', // type of response body
    input: body
  };
}

/**
 * Prepends the url with API_URL if it is relative, otherwise
 * returns the passed url unchanged.
 */
function processUrl (url) {
  if (url && url.indexOf('http') !== 0) {
    return `${API_URL}${url}`;
  }
  return url;
}

// Public functions
// ----------------

/**
 *
 * @typedef {Object} Response.
 * @return {number} statusCode The returned status code.
 * @return {Object} body The parsed JSON response.
 */

/**
 * Perform a GET request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL of the resource to get.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function get (authenticationToken, url) {
  return hookedHttpinvoke(processUrl(url), 'GET', optionsWithoutBody(authenticationToken));
}

/**
 * Perform a POST request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL to which the POST request will be sent.
 * @param {object} body The body of the POST request.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function post (authenticationToken, url, body) {
  return hookedHttpinvoke(processUrl(url), 'POST', optionsWithBody(authenticationToken, body));
}

/**
 * Perform a POST request with form data to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL to which the POST request will be sent.
 * @param {FormData} body The body of the POST request.
 * @param {function} uploadingCallback Callback that is called when HTTP request upload progress event happens.
 *                   It is called with these arguments:
 *                   - current is a number for the number of bytes currently sent.
 *                   - total is a number for the total number of bytes to be sent.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function postFormData (authenticationToken, url, body, uploadingCallback) {
  const options = optionsWithBodyForFormData(authenticationToken, body);
  if (uploadingCallback) {
    options.uploading = uploadingCallback;
  }
  return hookedHttpinvoke(processUrl(url), 'POST', options);
}

/**
 * Perform a PUT request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL to which the PUT request will be sent.
 * @param {object} body The body of the PUT request.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function put (authenticationToken, url, body) {
  return hookedHttpinvoke(processUrl(url), 'PUT', optionsWithBody(authenticationToken, body));
}

/**
 * Perform a DELETE request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL of the resource to delete.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function del (authenticationToken, url) {
  return hookedHttpinvoke(processUrl(url), 'DELETE', optionsWithoutBody(authenticationToken));
}

export function getApiBaseUrl () {
  return API_URL;
}

/**
 * Returns the base url of the apptvate website, as retrieved from the config file.
 * @param {string} url The requested base url.
 */
export function getApptvateWebsiteUrl () {
  return APPTVATE_WEBSITE_URL;
}

/**
 * Returns the base url of the cms, as retrieved from the config file.
 * @param {string} url The requested base url.
 */
export function getCmsUrl () {
  return CMS_URL;
}

/**
 * Returns the base url of the new cms, as retrieved from the config file.
 * @param {string} url The requested base url.
 */
export function getCmsNextUrl () {
  return CMS_NEXT_URL;
}

/**
 * Returns the base url of the tagger, as retrieved from the config file.
 * @param {string} url The requested base url.
 */
export function getTaggerUrl () {
  return TAGGER_URL;
}
