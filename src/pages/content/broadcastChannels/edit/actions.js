import { uploadBroadcastChannelImage, persistBroadcastChannel, fetchBroadcastChannel as dataFetchBroadcastChannel } from '../../../../actions/broadcastChannel';

export const BROADCAST_CHANNEL_FETCH_ENTRY_ERROR = 'BROADCASTERS_EDIT/BROADCAST_CHANNEL_FETCH_ENTRY_ERROR';

export const submit = persistBroadcastChannel;
export const uploadImage = uploadBroadcastChannelImage;

export function load (broadcastChannelId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcastChannel({ broadcastChannelId }));
    } catch (error) {
      dispatch({ error, type: BROADCAST_CHANNEL_FETCH_ENTRY_ERROR });
    }
  };
}
