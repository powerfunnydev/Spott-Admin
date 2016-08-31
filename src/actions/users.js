import * as api from '../api/users';
import { apiBaseUrlSelector } from '../selectors/global';
import { makeApiActionCreator } from './utils';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const FORGOT_PASSWORD_START = 'FORGOT_PASSWORD_START';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR';

export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export function login ({ email, password }) {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_START });
    try {
      const baseUrl = apiBaseUrlSelector(getState());
      const data = await api.login(baseUrl, { email, password });
      dispatch({ data, type: LOGIN_SUCCESS });
      if (localStorage) {
        localStorage.setItem('session', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      dispatch({ error, type: LOGIN_ERROR });
      throw error;
    }
  };
}

export function logout () {
  return (dispatch) => {
    dispatch({ type: LOGOUT_START });
    dispatch({ type: LOGOUT_SUCCESS });
    if (localStorage) {
      localStorage.removeItem('session');
    }
  };
}

export const forgotPassword = makeApiActionCreator(api.forgotPassword, FORGOT_PASSWORD_START, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_ERROR);
