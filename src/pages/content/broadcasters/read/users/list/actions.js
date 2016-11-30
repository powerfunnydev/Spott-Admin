import { deleteLinkUser as dataDeleteLinkUser,
  deleteLinkUsers as dataDeleteLinkUsers,
  fetchBroadcasterUsers as dataFetchBroadcasterUsers
} from '../../../../../../actions/broadcaster';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';
// import { deleteUser as dataDeleteUser } from '../../../../../actions/user';

// Action types
// ////////////

export const USERS_FETCH_START = 'BROADCASTERS/USERS_FETCH_START';
export const USERS_FETCH_ERROR = 'BROADCASTERS/USERS_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTERS/USERS_SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTERS/USERS_SELECT_CHECKBOX';

export const SORT_COLUMN = 'BROADCASTERS/USERS_SORT_COLUMN';

export const LINK_USER_DELETE_ERROR = 'BROADCASTERS/LINK_USER_DELETE_ERROR';
export const LINK_USERS_DELETE_ERROR = 'BROADCASTERS/LINK_USERS_DELETE_ERROR';

export function deleteLinkUser (broadcasterId, userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteLinkUser({ broadcasterId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_DELETE_ERROR });
    }
  };
}

export function deleteLinkUsers (broadcasterId, userIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteLinkUsers({ broadcasterId, userIds }));
    } catch (error) {
      dispatch({ error, type: LINK_USERS_DELETE_ERROR });
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

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
