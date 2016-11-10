import { persistBroadcaster, fetchBroadcaster as dataFetchBroadcaster } from '../../../../actions/broadcaster';

export const BROADCASTER_FETCH_ENTRY_ERROR = 'BROADCASTERS_READ/FETCH_ENTRY_ERROR';

export const submit = persistBroadcaster;

export function loadBroadcaster (broadcasterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcaster({ broadcasterId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_FETCH_ENTRY_ERROR });
    }
  };
}
