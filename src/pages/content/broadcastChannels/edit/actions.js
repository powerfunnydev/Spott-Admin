import { persistBroadcastChannelEntry, fetchBroadcastChannelEntry as dataFetchBroadcastChannelEntry } from '../../../../actions/broadcastChannel';

export const BROADCAST_CHANNEL_FETCH_ENTRY_ERROR = 'BROADCASTERS_EDIT/BROADCAST_CHANNEL_FETCH_ENTRY_ERROR';

export const submit = persistBroadcastChannelEntry;

export function load (broadcastChannelEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcastChannelEntry({ broadcastChannelEntryId }));
    } catch (error) {
      dispatch({ error, type: BROADCAST_CHANNEL_FETCH_ENTRY_ERROR });
    }
  };
}
