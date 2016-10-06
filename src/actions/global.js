import { getConfiguration } from '../api/config';

export const CONFIGURE = 'CONFIGURE';

export const MODAL_OPEN_LOGIN = 'MODAL_OPEN_LOGIN';
export const MODAL_OPEN_FORGOT_PASSWORD = 'MODAL_OPEN_FORGOT_PASSWORD';

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
