import * as api from '../api/users';
import { apiBaseUrlSelector } from '../selectors/global';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export function login ({ email, password }) {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_REQUEST });
    try {
      const baseUrl = apiBaseUrlSelector(getState());
      const data = await api.login(baseUrl, { email, password });
      dispatch({ data, type: LOGIN_SUCCESS });
      if (localStorage) {
        localStorage.setItem('session', JSON.stringify(data));
      }
      return data;
    } catch (error) {
      dispatch({ error, type: LOGIN_FAILURE });
      throw error;
    }
  };
}
