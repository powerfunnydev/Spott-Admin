import { getConfiguration } from '../api/config';

export const CONFIGURE = 'CONFIGURE';

export const AUTHENTICATE = 'AUTHENTICATE';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const MODAL_OPEN_LOGIN = 'MODAL_OPEN_LOGIN';
export const MODAL_CLOSE = 'MODAL_CLOSE';

export function init () {
  return async (dispatch) => {
    const configuration = await getConfiguration();
    dispatch({ type: CONFIGURE, configuration });
  };
}

/**
 * Authenticate the user, setting an access token for the rest of the app's lifetime.
 * @return {string} The session token
 */
export function authenticate (username, authenticationToken) {
  return { type: AUTHENTICATE, username, authenticationToken };
}

export function openLoginModal () {
  return { type: MODAL_OPEN_LOGIN };
}

export function closeModal () {
  return { type: MODAL_CLOSE };
}
