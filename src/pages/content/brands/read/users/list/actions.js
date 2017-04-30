import {
  deleteLinkUser as dataDeleteLinkUser,
  deleteLinkUsers as dataDeleteLinkUsers,
  fetchBrandUsers as dataFetchBrandUsers
} from '../../../../../../actions/brand';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';
// import { deleteUser as dataDeleteUser } from '../../../../../actions/user';

// Action types
// ////////////

export const USERS_FETCH_START = 'BRAND/USERS_FETCH_START';
export const USERS_FETCH_ERROR = 'BRAND/USERS_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BRAND/USERS_SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BRAND/USERS_SELECT_CHECKBOX';

export const SORT_COLUMN = 'BRAND/USERS_SORT_COLUMN';

export const LINK_USER_DELETE_ERROR = 'BRAND/LINK_USER_DELETE_ERROR';
export const LINK_USERS_DELETE_ERROR = 'BRAND/LINK_USERS_DELETE_ERROR';

export function deleteLinkUser (brandId, userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteLinkUser({ brandId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_DELETE_ERROR });
    }
  };
}

export function deleteLinkUsers (brandId, userIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteLinkUsers({ brandId, userIds }));
    } catch (error) {
      dispatch({ error, type: LINK_USERS_DELETE_ERROR });
    }
  };
}

export function load (query, brandId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBrandUsers({ ...getInformationFromQuery(query, prefix), brandId }));
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
