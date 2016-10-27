import { fetchBroadcasters as dataFetchBroadcasters,
  deleteBroadcastersEntry as dataDeleteBroadcastersEntry,
  deleteBroadcastersEntries as dataDeleteBroadcastersEntries } from '../../../../actions/broadcasters';

// Action types
// ////////////

export const BROADCASTERS_FETCH_START = 'BROADCASTERS/BROADCASTERS_FETCH_START';
export const BROADCASTERS_FETCH_ERROR = 'BROADCASTERS/BROADCASTERS_FETCH_ERROR';

export const BROADCASTERS_ENTRIES_DELETE_ERROR = 'BROADCASTERS/BROADCASTERS_ENTRIES_REMOVE_ERROR';
export const BROADCASTERS_ENTRY_DELETE_ERROR = 'BROADCASTERS/BROADCASTERS_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTERS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTERS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'BROADCASTERS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcasters(query));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_FETCH_ERROR });
    }
  };
}

export function deleteBroadcastersEntries (broadcastersEntryIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBroadcastersEntries({ broadcastersEntryIds }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_ENTRIES_DELETE_ERROR });
    }
  };
}

export function deleteBroadcastersEntry (broadcastersEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBroadcastersEntry({ broadcastersEntryId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_ENTRY_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
