/**
 * Constructs a UnauthorizedError error wrapper.
 */
export class UnauthorizedError extends Error {
  constructor () {
    super();
    this.name = 'UnauthorizedError';
  }
}

/**
 * Constructs a Bad Request error wrapper.
 */
export class BadRequestError extends Error {
  constructor (code, originalError) {
    super();
    this.name = 'BadRequestError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Constructs a Not Found error wrapper.
 */
export class NotFoundError extends Error {
  constructor (code, originalError) {
    super();
    this.name = 'NotFoundError';
    this.code = code;
    this.originalError = originalError;
  }
}

/**
 * Constructs a Unexpected error wrapper.
 */
export class UnexpectedError extends Error {
  constructor (originalError) {
    super();
    this.name = 'UnexpectedError';
    this.originalError = originalError;
  }
}
