import { persistBroadcastersEntry, fetchBroadcastersEntry as dataFetchBroadcastersEntry, fetchBroadcasterChannels as dataFetchBroadcasterChannels } from '../../../../actions/broadcasters';

export const BROADCASTER_FETCH_ENTRY_ERROR = 'BROADCASTER_READ/FETCH_ENTRY_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTER_READ/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTER_READ/SELECT_CHECKBOX';

export const submit = persistBroadcastersEntry;

export function load (queryWithBroadcasterId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataFetchBroadcasterChannels(queryWithBroadcasterId));
      return await dispatch(dataFetchBroadcastersEntry(queryWithBroadcasterId));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_FETCH_ENTRY_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
