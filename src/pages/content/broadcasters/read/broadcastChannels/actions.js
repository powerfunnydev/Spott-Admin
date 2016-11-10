import { fetchBroadcasterChannels as dataFetchBroadcasterChannels } from '../../../../../actions/broadcaster';
import { deleteBroadcastChannel as dataDeleteBroadcastChannel } from '../../../../../actions/broadcastChannel';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTERS_READ/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTERS_READ/SELECT_CHECKBOX';

export const BROADCASTER_CHANNELS_FETCH_ENTRY_ERROR = 'BROADCASTERS_READ/BROADCASTER_CHANNELS_FETCH_ENTRY_ERROR';
export const BROADCAST_CHANNEL_DELETE_ENTRY_ERROR = 'BROADCASTERS_READ/BROADCAST_CHANNEL_DELETE_ENTRY_ERROR';

export function loadBroadcasterChannels (query, broadcasterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcasterChannels({ ...getInformationFromQuery(query, prefix), broadcasterId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_CHANNELS_FETCH_ENTRY_ERROR });
    }
  };
}

export function deleteBroadcastChannel (broadcastChannelId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataDeleteBroadcastChannel({ broadcastChannelId }));
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
