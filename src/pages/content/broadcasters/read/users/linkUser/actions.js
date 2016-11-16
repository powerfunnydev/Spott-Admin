import { persistLinkUser as dataPersistLinkUser } from '../../../../../../actions/broadcaster';

// Action types
// ////////////

export const LINK_USER_PERSIST_ERROR = 'BROADCASTER/LINK_USER_PERSIST_ERROR';

export function persistLinkUser (broadcasterId, userId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataPersistLinkUser({ broadcasterId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_PERSIST_ERROR });
    }
  };
}
