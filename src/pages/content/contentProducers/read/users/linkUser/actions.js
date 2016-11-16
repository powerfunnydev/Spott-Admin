import { persistLinkUser as dataPersistLinkUser } from '../../../../../../actions/contentProducer';

// Action types
// ////////////

export const LINK_USER_PERSIST_ERROR = 'CONTENT_PRODUCER/LINK_USER_PERSIST_ERROR';

export function persistLinkUser (contentProducerId, userId) {
  return async (dispatch, getState) => {
    try {
      console.log(contentProducerId, userId);
      return await dispatch(dataPersistLinkUser({ contentProducerId, userId }));
    } catch (error) {
      dispatch({ error, type: LINK_USER_PERSIST_ERROR });
    }
  };
}
