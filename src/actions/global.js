import { getConfiguration } from '../api/config';
import { push as routerPush } from 'react-router-redux';

export const CONFIGURE = 'CONFIGURE';

export const MODAL_OPEN_LOGIN = 'MODAL_OPEN_LOGIN';
export const MODAL_OPEN_FORGOT_PASSWORD = 'MODAL_OPEN_FORGOT_PASSWORD';

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

export function init () {
  return async (dispatch) => {
    const configuration = await getConfiguration();
    dispatch({ type: CONFIGURE, configuration });
  };
}

export function openLoginModal () {
  return { type: MODAL_OPEN_LOGIN };
}

export function openForgotPasswordModal () {
  return { type: MODAL_OPEN_FORGOT_PASSWORD };
}
