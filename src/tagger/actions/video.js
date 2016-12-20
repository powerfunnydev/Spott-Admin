import {
  VIDEO_FETCH_ERROR, VIDEO_FETCH_START, VIDEO_FETCH_SUCCESS,
  VIDEO_SELECT_START, VIDEO_SELECT_SUCCESS, VIDEO_SELECT_ERROR
} from '../constants/actionTypes';
import { getVideo } from '../api/video';
import { makeFetchRecordActionCreator } from '../actions/_utils';
import { selectFirstScene } from './scene';
import { selectFirstScene as organizerSelectFirstScene } from './organizer';
import { fetchSceneGroups } from './sceneGroup';

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
export function select (data) {
  return {
    types: [ VIDEO_SELECT_START, VIDEO_SELECT_SUCCESS, VIDEO_SELECT_ERROR ],
    payload: [
      // makeFetchRecordActionCreator returns a {function(id: string): Promise<Object, Error>},
      // which triggers an action with type 'VIDEO_FETCH_START', then performs the API call for video retrieval.
      // Upon finishing the request, an action with either type 'VIDEO_FETCH_SUCCESS' or 'VIDEO_FETCH_ERROR' is triggered.
      makeFetchRecordActionCreator(getVideo, null, VIDEO_FETCH_START, VIDEO_FETCH_SUCCESS, VIDEO_FETCH_ERROR).bind(null, data),
      organizerSelectFirstScene,
      // Fetch the scene groups of the video.
      fetchSceneGroups.bind(null, data),
      // Fetch the first scene, which will also load the characters and products in that scene.
      selectFirstScene
    ],
    // Fetching the video (including it's scenes) and fetching the first scene of the video, should happen sequentially.
    sequence: true
  };
}
