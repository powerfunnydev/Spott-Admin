import { getConfiguration, getAuthorizedConfiguration } from '../api/config';
import { push as routerPush } from 'react-router-redux';
import { userRolesSelector, authenticationTokenSelector, apiBaseUrlSelector, currentLocaleSelector } from '../selectors/global';

export const CONFIGURE = 'CONFIGURE';

export const MODAL_OPEN = 'MODAL_OPEN';
export const MODAL_CLOSE = 'MODAL_CLOSE';

export function routerPushWithReturnTo (newUrlOrLocationObject, goBack) {
  return async (dispatch, getState) => {
    // in case newUrlOrLocationObject is an location object, use this object.
    if (typeof newUrlOrLocationObject === 'object') {
      return dispatch(routerPush(newUrlOrLocationObject));
    }
    // current location
    const location = getState().get('router').locationBeforeTransitions;
    // when we want to go to the previous page, we check if there is a returnTo object.
    if (goBack && location && location.state && typeof location.state.returnTo === 'object') {
      return dispatch(routerPush(location.state.returnTo));
    }
    // If there is no object or we didn't want to the previous page, go to newUrlOrLocationObject.
    return dispatch(routerPush({ pathname: newUrlOrLocationObject, state: { returnTo: location } }));
  };
}

export function getAuthorizedConfig () {
  return async (dispatch, getState) => {
    const state = getState();
    const apiBaseUrl = apiBaseUrlSelector(state);
    const authenticationToken = authenticationTokenSelector(state);
    const locale = currentLocaleSelector(state);
    const roles = userRolesSelector(state);
    if (authenticationToken) {
      // Get backend configuration
      const configuration = await getAuthorizedConfiguration(apiBaseUrl, authenticationToken, locale, roles);
      dispatch({ configuration, type: CONFIGURE });
    }
  };
}

export function init () {
  return async (dispatch) => {
    const configuration = await getConfiguration();
    dispatch({ type: CONFIGURE, configuration });
  };
}

export function openModal (modal) {
  return { modal, type: MODAL_OPEN };
}

export function closeModal () {
  return { type: MODAL_CLOSE };
}
