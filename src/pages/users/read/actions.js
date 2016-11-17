import { fetchUser as dataFetchUser } from '../../../actions/user';

export const USER_FETCH_ENTRY_ERROR = 'USERS_READ/FETCH_ENTRY_ERROR';

export function loadUser (userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchUser({ userId }));
    } catch (error) {
      dispatch({ error, type: USER_FETCH_ENTRY_ERROR });
    }
  };
}
