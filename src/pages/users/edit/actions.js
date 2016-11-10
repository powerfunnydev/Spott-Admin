import { uploadProfileImage as dataUploadProfileImage, uploadBackgroundImage as dataUploadBackgroundImage,
    persistUser, fetchUser as dataFetchUser, forgotPassword as dataResetPassword } from '../../../actions/user';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../actions/contentProducer';

export const USER_FETCH_ENTRY_ERROR = 'USERS_EDIT/USER_FETCH_ENTRY_ERROR';

export const CONTENT_PRODUCERS_SEARCH_START = 'USERS_EDIT/CONTENT_PRODUCERS_SEARCH_START';
export const CONTENT_PRODUCERS_SEARCH_ERROR = 'USERS_EDIT/CONTENT_PRODUCERS_SEARCH_ERROR';

export const BROADCASTERS_SEARCH_START = 'USERS_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'USERS_EDIT/BROADCASTERS_SEARCH_ERROR';

export const FORGOT_PASSWORD_SUCCESS = 'USERS_EDIT/FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_ERROR = 'USERS_EDIT/FORGOT_PASSWORD_ERROR';
export const CLEAR_POP_UP_MESSAGE = 'USERS_EDIT/CLEAR_POP_UP_MESSAGE';

export const submit = persistUser;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadBackgroundImage = dataUploadBackgroundImage;

export function resetPassword (email) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataResetPassword({ email }));
      dispatch({ type: FORGOT_PASSWORD_SUCCESS });
    } catch (error) {
      dispatch({ type: FORGOT_PASSWORD_ERROR, error });
    }
  };
}

export function clearPopUpMessage () {
  return async (dispatch, getState) => {
    dispatch({ type: CLEAR_POP_UP_MESSAGE });
  };
}

export function load (userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchUser({ userId }));
    } catch (error) {
      dispatch({ error, type: USER_FETCH_ENTRY_ERROR });
    }
  };
}

export function searchContentProducers (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: CONTENT_PRODUCERS_SEARCH_START, searchString });
      return await dispatch(dataSearchContentProducers({ searchString }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCERS_SEARCH_ERROR });
    }
  };
}
export function searchBroadcasters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BROADCASTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchBroadcasters({ searchString }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_SEARCH_ERROR });
    }
  };
}
