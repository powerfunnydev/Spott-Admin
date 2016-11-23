import * as api from '../api/user';
import { apiBaseUrlSelector } from '../selectors/global';
import { makeApiActionCreator } from './utils';
import { getAuthorizedConfig } from './global';

export const USER_SEARCH_START = 'USERS/USER_SEARCH_START';
export const USER_SEARCH_SUCCESS = 'USERS/USER_SEARCH_SUCCESS';
export const USER_SEARCH_ERROR = 'USERS/USER_SEARCH_ERROR';

export const USER_UPLOAD_BACKGROUND_IMAGE_START = 'USERS/USER_UPLOAD_BACKGROUND_IMAGE_START';
export const USER_UPLOAD_BACKGROUND_IMAGE_SUCCESS = 'USERS/USER_UPLOAD_BACKGROUND_IMAGE_SUCCESS';
export const USER_UPLOAD_BACKGROUND_IMAGE_ERROR = 'USERS/USER_UPLOAD_BACKGROUND_IMAGE_ERROR';

export const USER_UPLOAD_PROFILE_IMAGE_START = 'USERS/USER_UPLOAD_PROFILE_IMAGE_START';
export const USER_UPLOAD_PROFILE_IMAGE_SUCCESS = 'USERS/USER_UPLOAD_PROFILE_IMAGE_SUCCESS';
export const USER_UPLOAD_PROFILE_IMAGE_ERROR = 'USERS/USER_UPLOAD_PROFILE_IMAGE_ERROR';

export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const FORGOT_PASSWORD_START = 'FORGOT_PASSWORD_START';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_ERROR = 'FORGOT_PASSWORD_ERROR';

export const RESET_PASSWORD_START = 'RESET_PASSWORD_START';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR = 'RESET_PASSWORD_ERROR';

export const LOGOUT_START = 'LOGOUT_START';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

export const USERS_FETCH_START = 'USERS/USERS_FETCH_START';
export const USERS_FETCH_SUCCESS = 'USERS/USERS_FETCH_SUCCESS';
export const USERS_FETCH_ERROR = 'USERS/USERS_FETCH_ERROR';

export const USER_FETCH_START = 'USERS/USER_FETCH_START';
export const USER_FETCH_SUCCESS = 'USERS/USER_FETCH_SUCCESS';
export const USER_FETCH_ERROR = 'USERS/USER_FETCH_ERROR';

export const USER_CHANNELS_FETCH_START = 'USERS/USER_CHANNELS_FETCH_START';
export const USER_CHANNELS_FETCH_SUCCESS = 'USERS/USER_CHANNELS_FETCH_SUCCESS';
export const USER_CHANNELS_FETCH_ERROR = 'USERS/USER_CHANNELS_FETCH_ERROR';

export const USER_PERSIST_START = 'USERS/USER_PERSIST_START';
export const USER_PERSIST_SUCCESS = 'USERS/USER_PERSIST_SUCCESS';
export const USER_PERSIST_ERROR = 'USERS/USER_PERSIST_ERROR';

export const USER_DELETE_START = 'USERS/USER_DELETE_START';
export const USER_DELETE_SUCCESS = 'USERS/USER_DELETE_SUCCESS';
export const USER_DELETE_ERROR = 'USERS/USER_DELETE_ERROR';

export const USERS_ENTRIES_DELETE_START = 'USERS/USERS_ENTRIES_DELETE_START';
export const USERS_ENTRIES_DELETE_SUCCESS = 'USERS/USERS_ENTRIES_DELETE_SUCCESS';
export const USERS_ENTRIES_DELETE_ERROR = 'USERS/USERS_ENTRIES_DELETE_ERROR';

export function login ({ authenticationToken, email, password }) {
  return async (dispatch, getState) => {
    dispatch({ type: LOGIN_START });
    try {
      const state = getState();
      const baseUrl = apiBaseUrlSelector(state);
      const data = await api.login(baseUrl, { authenticationToken, email, password });
      dispatch({ data, type: LOGIN_SUCCESS });
      if (localStorage) {
        localStorage.setItem('session', JSON.stringify(data));
      }
      await dispatch(getAuthorizedConfig());
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
    // Go to home page and reload.
    window.location.href = '/';
  };
}

export const forgotPassword = makeApiActionCreator(api.forgotPassword, FORGOT_PASSWORD_START, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_ERROR);
export const resetPassword = makeApiActionCreator(api.resetPassword, RESET_PASSWORD_START, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_ERROR);

export const fetchUsers = makeApiActionCreator(api.fetchUsers, USERS_FETCH_START, USERS_FETCH_SUCCESS, USERS_FETCH_ERROR);
export const fetchUser = makeApiActionCreator(api.fetchUser, USER_FETCH_START, USER_FETCH_SUCCESS, USER_FETCH_ERROR);
export const persistUser = makeApiActionCreator(api.persistUser, USER_PERSIST_START, USER_PERSIST_SUCCESS, USER_PERSIST_ERROR);
export const deleteUsers = makeApiActionCreator(api.deleteUsers, USERS_ENTRIES_DELETE_START, USERS_ENTRIES_DELETE_SUCCESS, USERS_ENTRIES_DELETE_ERROR);
export const deleteUser = makeApiActionCreator(api.deleteUser, USER_DELETE_START, USER_DELETE_SUCCESS, USER_DELETE_ERROR);
export const searchUsers = makeApiActionCreator(api.searchUsers, USER_SEARCH_START, USER_SEARCH_SUCCESS, USER_SEARCH_ERROR);
export const uploadProfileImage = makeApiActionCreator(api.uploadProfileImage, USER_UPLOAD_PROFILE_IMAGE_START, USER_UPLOAD_PROFILE_IMAGE_SUCCESS, USER_UPLOAD_PROFILE_IMAGE_ERROR);
export const uploadBackgroundImage = makeApiActionCreator(api.uploadBackgroundImage, USER_UPLOAD_BACKGROUND_IMAGE_START, USER_UPLOAD_BACKGROUND_IMAGE_SUCCESS, USER_UPLOAD_BACKGROUND_IMAGE_ERROR);
