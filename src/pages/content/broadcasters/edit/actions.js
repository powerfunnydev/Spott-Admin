import { persistBroadcastersEntry, fetchBroadcastersEntry as dataFetchBroadcastersEntry } from '../../../../actions/broadcasters';

export const BROADCASTERS_FETCH_ENTRY_ERROR = 'BROADCASTERS_EDIT/FETCH_ENTRY_ERROR';

export const submit = persistBroadcastersEntry;

export function load (broadcastersEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcastersEntry({ broadcastersEntryId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_FETCH_ENTRY_ERROR });
    }
  };
}
