import { uploadBroadcasterImage, persistBroadcaster, fetchBroadcaster as dataFetchBroadcaster } from '../../../../actions/broadcaster';

export const BROADCASTERS_FETCH_ENTRY_ERROR = 'BROADCASTERS_EDIT/FETCH_ENTRY_ERROR';

export const submit = persistBroadcaster;
export const uploadImage = uploadBroadcasterImage;

export function load (broadcasterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBroadcaster({ broadcasterId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_FETCH_ENTRY_ERROR });
    }
  };
}
