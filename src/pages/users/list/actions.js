import {
  fetchUsers as dataFetchUsers,
  deleteUsers as dataDeleteUsers,
  deleteUser as dataDeleteUser
} from '../../../actions/user';

// Action types
// ////////////

export const USERS_FETCH_START = 'USERS/USERS_FETCH_START';
export const USERS_FETCH_ERROR = 'USERS/USERS_FETCH_ERROR';

export const USERS_DELETE_ERROR = 'USERS/USERS_DELETE_ERROR';
export const USER_DELETE_ERROR = 'USERS/USER_DELETE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'USERS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'USERS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'USERS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchUsers(query));
    } catch (error) {
      dispatch({ error, type: USERS_FETCH_ERROR });
    }
  };
}

export function deleteUsers (userIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteUsers({ userIds }));
    } catch (error) {
      dispatch({ error, type: USERS_DELETE_ERROR });
    }
  };
}

export function deleteUser (userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteUser({ userId }));
    } catch (error) {
      dispatch({ error, type: USERS_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
