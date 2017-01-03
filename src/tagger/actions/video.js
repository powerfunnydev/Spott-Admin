import * as videoApi from '../api/video';
import { makeApiActionCreator } from '../actions/_utils';
import { selectFirstScene } from './scene';
import { selectFirstScene as organizerSelectFirstScene } from './organizer';
import { selectFirstScene as mvpSelectFirstScene } from './mvp';
import { fetchSceneGroups } from './sceneGroup';

export const VIDEO_FETCH_START = 'VIDEO/VIDEO_FETCH_START';
export const VIDEO_FETCH_SUCCESS = 'VIDEO/VIDEO_FETCH_SUCCESS';
export const VIDEO_FETCH_ERROR = 'VIDEO/VIDEO_FETCH_ERROR';

export const VIDEO_PERSIST_START = 'VIDEO/VIDEO_PERSIST_START';
export const VIDEO_PERSIST_SUCCESS = 'VIDEO/VIDEO_PERSIST_SUCCESS';
export const VIDEO_PERSIST_ERROR = 'VIDEO/VIDEO_PERSIST_ERROR';

export const VIDEO_SELECT_START = 'VIDEO/VIDEO_SELECT_START';
export const VIDEO_SELECT_SUCCESS = 'VIDEO/VIDEO_SELECT_SUCCESS';
export const VIDEO_SELECT_ERROR = 'VIDEO/VIDEO_SELECT_ERROR';

export const fetchVideo = makeApiActionCreator(videoApi.getVideo, VIDEO_FETCH_START, VIDEO_FETCH_SUCCESS, VIDEO_FETCH_ERROR);

/**
 * Combined action creator for fetching a video AND selecting it's first scene
 * (which is also a combined action which loads the characters and products).
 * If one of these actions fails, the state is restored in the app reducer
 * which will handle it in the VIDEO_SELECT_ERROR action.
 * @param {Object} data
 @ @param {string} data.videoId The unique identifier of the video to fetch.
 * @return {Object} An object with types, payload and sequence, consumed by the
 * redux-combine-actions redux middleware.
 */
export function select ({ videoId }) {
  return async (dispatch) => {
    try {
      dispatch({ type: VIDEO_SELECT_START, videoId });
      // Get the video and its scenes.
      await dispatch(fetchVideo({ videoId }));
      // Fetch the scene groups of the video.
      await dispatch(fetchSceneGroups({ videoId }));

      dispatch(organizerSelectFirstScene());
      dispatch(selectFirstScene());
      dispatch(mvpSelectFirstScene());
      dispatch({ type: VIDEO_SELECT_SUCCESS, videoId });
    } catch (error) {
      dispatch({ error, type: VIDEO_SELECT_ERROR });
    }
  };
  // return {
  //   types: [ , ,  ],
  //   payload: [
  //     // makeFetchRecordActionCreator returns a {function(id: string): Promise<Object, Error>},
  //     // which triggers an action with type 'VIDEO_FETCH_START', then performs the API call for video retrieval.
  //     // Upon finishing the request, an action with either type 'VIDEO_FETCH_SUCCESS' or 'VIDEO_FETCH_ERROR' is triggered.
  //     // Fetch the first scene, which will also load the characters and products in that scene.
  //     ,
  //
  //   ],
  //   // Fetching the video (including it's scenes) and fetching the first scene of the video, should happen sequentially.
  //   sequence: true
  // };
}

export const persistVideo = makeApiActionCreator(videoApi.postVideo, VIDEO_PERSIST_START, VIDEO_PERSIST_SUCCESS, VIDEO_PERSIST_ERROR);
