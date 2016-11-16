import { searchUsers as dataSearchUsers } from '../../../actions/user';

export const USERS_SEARCH_START = 'LINK_USER_MODAL/USERS_SEARCH_START';
export const USERS_SEARCH_ERROR = 'LINK_USER_MODAL/USERS_SEARCH_ERROR';

export function searchUsers (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: USERS_SEARCH_START, searchString });
      return await dispatch(dataSearchUsers({ searchString }));
    } catch (error) {
      dispatch({ error, type: USERS_SEARCH_ERROR });
    }
  };
}
