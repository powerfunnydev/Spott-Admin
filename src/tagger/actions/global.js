import { AUTHENTICATE, MAIN_SELECT_TAB, SHOW_TOOLTIP, HIDE_TOOLTIP } from '../constants/actionTypes';

/**
 * Authenticate the user, setting an access token for the rest of the app's lifetime.
 * @return {string} username
 * @return {string} authenticationToken
 */
export function authenticate (username, authenticationToken) {
  return { type: AUTHENTICATE, username, authenticationToken };
}

export function selectTab (tab) {
  return { tab, type: MAIN_SELECT_TAB };
}

// Show image on hover (product marker popup)
export function showTooltip ({ x, y, imageUrl }) {
  return { tooltip: { x, y, imageUrl }, type: SHOW_TOOLTIP };
}

export function hideTooltip () {
  return { type: HIDE_TOOLTIP };
}
