import { deleteLinkUser as dataDeleteLinkUser, fetchBroadcasterUsers as dataFetchBroadcasterUsers } from '../../../../../../actions/broadcaster';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';
// import { deleteUser as dataDeleteUser, deleteUsers as dataDeleteUsers } from '../../../../../actions/user';

// Action types
// ////////////

export const USERS_FETCH_START = 'BROADCASTERS/USERS_FETCH_START';
export const USERS_FETCH_ERROR = 'BROADCASTERS/USERS_FETCH_ERROR';

export const USERS_DELETE_ERROR = 'BROADCASTERS/USERS_DELETE_ERROR';
export const USER_DELETE_ERROR = 'BROADCASTERS/USER_DELETE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTERS/USERS_SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTERS/USERS_SELECT_CHECKBOX';

export const SORT_COLUMN = 'BROADCASTERS/USERS_SORT_COLUMN';

export const LINK_USER_DELETE_ERROR = 'BROADCASTERS/LINK_USER_DELETE_ERROR';

export function deleteLinkUser (broadcasterId, userId) {
  return async (dispatch, getState) => {
    try {
      console.log('broadcasterId', broadcasterId, 'userId', userId);
      return await dispatch(dataDeleteLinkUser({ broadcasterId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_DELETE_ERROR });
    }
  };
}

export function load (query, broadcasterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcasterUsers({ ...getInformationFromQuery(query, prefix), broadcasterId }));
    } catch (error) {
      dispatch({ error, type: USERS_FETCH_ERROR });
    }
  };
}
/*
export function deleteUsers (userIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteUsers({ userIds }));
    } catch (error) {
      dispatch({ error, type: USERS_DELETE_ERROR });
    }
  };
}*/

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
