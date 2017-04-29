import { persistLinkUser as dataPersistLinkUser } from '../../../../../../actions/brand';

// Action types
// ////////////

export const LINK_USER_PERSIST_ERROR = 'BRAND/LINK_USER_PERSIST_ERROR';

export function persistLinkUser (brandId, userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataPersistLinkUser({ brandId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_PERSIST_ERROR });
    }
  };
}
