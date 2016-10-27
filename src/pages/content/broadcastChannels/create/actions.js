import { persistBroadcastChannelsEntry } from '../../../../actions/broadcastChannel';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcasters';
export const submit = persistBroadcastChannelsEntry;

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
