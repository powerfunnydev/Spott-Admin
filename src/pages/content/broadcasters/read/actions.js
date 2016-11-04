import { persistBroadcastersEntry, fetchBroadcastersEntry as dataFetchBroadcastersEntry, fetchBroadcasterChannels as dataFetchBroadcasterChannels } from '../../../../actions/broadcasters';
import { deleteBroadcastChannelEntry as dataDeleteBroadcastChannelEntry } from '../../../../actions/broadcastChannel';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTERS_READ/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTERS_READ/SELECT_CHECKBOX';

export const BROADCASTER_FETCH_ENTRY_ERROR = 'BROADCASTERS_READ/FETCH_ENTRY_ERROR';
export const BROADCAST_CHANNEL_DELETE_ENTRY_ERROR = 'BROADCASTERS_READ/BROADCAST_CHANNEL_DELETE_ENTRY_ERROR';

export const submit = persistBroadcastersEntry;

export function loadBroadcaster (broadcastersEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcastersEntry({ broadcastersEntryId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_FETCH_ENTRY_ERROR });
    }
  };
}

export function loadBroadcasterChannels (queryWithBroadcasterId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataFetchBroadcasterChannels(queryWithBroadcasterId));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_FETCH_ENTRY_ERROR });
    }
  };
}

export function deleteBroadcastChannelEntry (broadcastChannelEntryId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataDeleteBroadcastChannelEntry({ broadcastChannelEntryId }));
    } catch (error) {
      dispatch({ error, type: BROADCAST_CHANNEL_DELETE_ENTRY_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
