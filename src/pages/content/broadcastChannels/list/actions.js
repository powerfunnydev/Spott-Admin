import { fetchBroadcastChannels as dataFetchBroadcastChannels,
  deleteBroadcastChannel as dataDeleteBroadcastChannel,
  deleteBroadcastChannels as dataDeleteBroadcastChannels } from '../../../../actions/broadcastChannel';

// Action types
// ////////////

export const BROADCAST_CHANNEL_ENTRIES_FETCH_START = 'BROADCAST_CHANNEL/BROADCAST_CHANNEL_ENTRIES_FETCH_START';
export const BROADCAST_CHANNEL_ENTRIES_FETCH_ERROR = 'BROADCAST_CHANNEL/BROADCAST_CHANNEL_ENTRIES_FETCH_ERROR';

export const BROADCAST_CHANNEL_ENTRIES_DELETE_ERROR = 'BROADCAST_CHANNEL/BROADCAST_CHANNEL_ENTRIES_REMOVE_ERROR';
export const BROADCAST_CHANNEL_ENTRY_DELETE_ERROR = 'BROADCAST_CHANNEL/BROADCAST_CHANNEL_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BROADCAST_CHANNEL/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCAST_CHANNEL/SELECT_CHECKBOX';

export const SORT_COLUMN = 'BROADCAST_CHANNEL/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcastChannels(query));
    } catch (error) {
      dispatch({ error, type: BROADCAST_CHANNEL_ENTRIES_FETCH_ERROR });
    }
  };
}

export function deleteBroadcastChannels (broadcastChannelIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBroadcastChannels({ broadcastChannelIds }));
    } catch (error) {
      dispatch({ error, type: BROADCAST_CHANNEL_ENTRIES_DELETE_ERROR });
    }
  };
}

export function deleteBroadcastChannel (broadcastChannelId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBroadcastChannel({ broadcastChannelId }));
    } catch (error) {
      dispatch({ error, type: BROADCAST_CHANNEL_ENTRY_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
