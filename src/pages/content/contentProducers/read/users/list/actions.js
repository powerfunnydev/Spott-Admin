import { deleteLinkUser as dataDeleteLinkUser, fetchContentProducerUsers as dataFetchContentProducerUsers } from '../../../../../../actions/contentProducer';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';
// import { deleteUser as dataDeleteUser, deleteUsers as dataDeleteUsers } from '../../../../../actions/user';

// Action types
// ////////////

export const USERS_FETCH_START = 'CONTENT_PRODUCER/USERS_FETCH_START';
export const USERS_FETCH_ERROR = 'CONTENT_PRODUCER/USERS_FETCH_ERROR';

export const USERS_DELETE_ERROR = 'CONTENT_PRODUCER/USERS_DELETE_ERROR';
export const USER_DELETE_ERROR = 'CONTENT_PRODUCER/USER_DELETE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'CONTENT_PRODUCER/USERS_SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'CONTENT_PRODUCER/USERS_SELECT_CHECKBOX';

export const SORT_COLUMN = 'CONTENT_PRODUCER/USERS_SORT_COLUMN';

export const LINK_USER_DELETE_ERROR = 'CONTENT_PRODUCER/LINK_USER_DELETE_ERROR';

export function deleteLinkUser (contentProducerId, userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteLinkUser({ contentProducerId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_DELETE_ERROR });
    }
  };
}

export function load (query, contentProducerId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchContentProducerUsers({ ...getInformationFromQuery(query, prefix), contentProducerId }));
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
