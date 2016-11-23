import httpinvoke from 'httpinvoke';

// Errors
// //////

/**
 * Lowest-level error.
 * Based upon: http://stackoverflow.com/questions/31089801/extending-error-in-javascript-with-es6-syntax
 */
export class RequestError extends Error {
  constructor (message, body, originalError) {
    super(message || 'An error occurred while processing your request.');
    this.name = 'RequestError';
    this.stack = (originalError || new Error()).stack;
    this.body = body;
    this.originalError = originalError;
  }
}

/**
 * Constructs a network error wrapper.
 */
export class NetworkError extends RequestError {
  constructor (originalError) {
    super('Network error. Please check your internet connection.', null, originalError);
    this.name = 'NetworkError';
  }
}

/**
 * Constructs a Unauthorized error wrapper.
 */
export class UnauthorizedError extends RequestError {
  constructor (body) {
    super('Unauthorized. Authentication required.', body, null);
    this.statusCode = 401;
    this.name = 'UnauthorizedError';
  }
}

/**
 * Constructs a Bad Request error wrapper.
 */
export class BadRequestError extends RequestError {
  constructor (body) {
    super('Invalid request.', body, null);
    this.statusCode = 400;
    this.name = 'BadRequestError';
  }
}

/**
 * Constructs a Not Found error wrapper.
 */
export class NotFoundError extends RequestError {
  constructor (message, body) {
    super('Could not find the requested resource.', body, null);
    this.statusCode = 404;
    this.name = 'NotFoundError';
  }
}

/**
 * Constructs a Unexpected error wrapper.
 */
export class UnexpectedError extends RequestError {
  constructor (message, body, originalError) {
    super(message || (originalError && originalError.message) || 'An unexpected error occurred while processing your request.', body, originalError);
    this.name = 'UnexpectedError';
  }
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
const hookedHttpinvoke = httpinvoke.hook('finished', (err, output, statusCode, headers) => {
  // httpinvoke failed?
  if (err) {
    // Was there a network error?
    if (typeof err === 'object' && err.message === 'network error') {
      return [ new NetworkError(err), output, statusCode, headers ];
    }
    // We do not know the exact reason, throw a general error
    return [ new UnexpectedError(null, null, err), output, statusCode, headers ];
  }
  // Convert 400's and 500's to error
  if (statusCode >= 400 && statusCode <= 599) {
    let responseError;
    // Try parse body text as JSON, but don't fail if we do not succeed.
    const newOutput = tryToParseJson(output);
    // Construct correct low-level error
    switch (statusCode) {
      case 400:
        responseError = new BadRequestError(newOutput); break;
      case 401:
      case 403:
        // We received 403 Forbidden. We are not authorized. This can be due to an invalid
        // expired authentication token. We do a hard reload of the application, which will
        // redirect us to login. Ugly, but effective!
        window.localStorage.removeItem('session');
        return window.location.reload();
      case 404:
        responseError = new NotFoundError(newOutput); break;
      default:
        responseError = new UnexpectedError(null, newOutput);
    }
    return [ responseError, newOutput, statusCode, headers ];
  }
  return [ null, tryToParseJson(output), statusCode, headers ];
});

// Internal helpers
// ----------------

const CONVERTERS = {
  'json text': JSON.stringify,
  'text json': (identity) => identity
};

function optionsWithoutBody (authenticationToken, locale = 'en') {
  return {
    converters: CONVERTERS,
    headers: { // Request headers
      authtoken: authenticationToken,
      'Accept-Language': locale
    },
    outputType: 'json'
  };
}

function optionsWithBody (authenticationToken, locale = 'en', body) {
  return {
    converters: CONVERTERS,
    headers: { // Request headers
      'Content-Type': 'application/json',
      authtoken: authenticationToken,
      'Accept-Language': locale
    },
    input: body || {},
    inputType: 'json', // Type of request data
    outputType: 'json' // Type of response body
  };
}

function optionsWithBodyForFormData (authenticationToken, locale = 'en', body) {
  return {
    converters: CONVERTERS,
    headers: { // Request headers
      authtoken: authenticationToken,
      'Accept-Language': locale
    },
    inputType: 'formdata', // type of request data
    outputType: 'text', // type of response body
    input: body
  };
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
export function get (authenticationToken, locale, url) {
  return hookedHttpinvoke(url, 'GET', optionsWithoutBody(authenticationToken, locale));
}

/**
 * Perform a POST request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL to which the POST request will be sent.
 * @param {object} body The body of the POST request.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function post (authenticationToken, locale, url, body) {
  return hookedHttpinvoke(url, 'POST', optionsWithBody(authenticationToken, locale, body));
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
export function postFormData (authenticationToken, locale, url, body, uploadingCallback) {
  const options = optionsWithBodyForFormData(authenticationToken, locale, body);
  if (uploadingCallback) {
    options.uploading = uploadingCallback;
  }
  return hookedHttpinvoke(url, 'POST', options);
}

/**
 * Perform a PUT request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL to which the PUT request will be sent.
 * @param {object} body The body of the PUT request.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function put (authenticationToken, locale, url, body) {
  return hookedHttpinvoke(url, 'PUT', optionsWithBody(authenticationToken, locale, body));
}

/**
 * Perform a DELETE request to the given URL.
 * @param {string} authenticationToken The authentication token to send in the header.
 * @param {string} url The URL of the resource to delete.
 * @return {Promise<Response, Object}>} The server response or resulting error.
 */
export function del (authenticationToken, locale, url) {
  return hookedHttpinvoke(url, 'DELETE', optionsWithoutBody(authenticationToken, locale));
}
