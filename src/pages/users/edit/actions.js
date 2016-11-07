import { uploadUserImage, persistUser, fetchUser as dataFetchUser } from '../../../actions/user';

export const USER_FETCH_ENTRY_ERROR = 'USERS_EDIT/USER_FETCH_ENTRY_ERROR';

export const submit = persistUser;
export const uploadImage = uploadUserImage;

export function load (userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchUser({ userId }));
    } catch (error) {
      dispatch({ error, type: USER_FETCH_ENTRY_ERROR });
    }
  };
}
