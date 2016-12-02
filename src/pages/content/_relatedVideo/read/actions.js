import { fetchVideo as dataFetchVideo } from '../../../../actions/video';

export const VIDEO_FETCH_ERROR = 'VIDEO_EDIT/VIDEO_FETCH_ERROR';

export function loadVideo (videoId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchVideo({ videoId }));
    } catch (error) {
      dispatch({ error, type: VIDEO_FETCH_ERROR });
    }
  };
}
