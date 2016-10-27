import { persistBroadcastersEntry, fetchBroadcastersEntry as dataFetchBroadcastersEntry } from '../../../../actions/broadcasters';

export const BROADCASTER_FETCH_ENTRY_ERROR = 'BROADCASTER_READ/FETCH_ENTRY_ERROR';
export const LOAD = 'BROADCASTER_READ/LOAD';

export const submit = persistBroadcastersEntry;

export function load (broadcastersEntryId) {
  return async (dispatch, getState) => {
    try {
      dispatch({ broadcastersEntryId, type: LOAD });
      return await dispatch(dataFetchBroadcastersEntry({ broadcastersEntryId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_FETCH_ENTRY_ERROR });
    }
  };
}
