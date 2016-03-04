import { AUTHENTICATE, MODAL_OPEN_LOGIN, MODAL_CLOSE } from '../constants/actionTypes';

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
