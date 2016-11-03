import { persistBroadcastChannelEntry } from '../../../../actions/broadcastChannel';
import { searchBroadcasters as dataSearchBroadcasters, fetchBroadcasterChannels as dataFetchBroadcasterChannels } from '../../../../actions/broadcasters';

export const submit = persistBroadcastChannelEntry;

export const BROADCASTERS_SEARCH_START = 'BROADCAST_CHANNELS_CREATE/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'BROADCAST_CHANNELS_CREATE/BROADCASTERS_SEARCH_ERROR';

export function searchBroadcasters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BROADCASTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchBroadcasters({ searchString }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_SEARCH_ERROR });
    }
  };
}

/**
 * Load Broadcast Channels of a broadcaster.
 */
export function loadBroadcasterChannels (broadcastersEntryId) {
  return async (dispatch, getState) => {
    return await dispatch(dataFetchBroadcasterChannels({ broadcastersEntryId }));
  };
}
