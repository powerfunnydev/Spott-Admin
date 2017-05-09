/* eslint-disable prefer-const */
import { destroy } from 'redux-form/immutable';
import * as mediaApi from '../api/media';
import { apiBaseUrlSelector, authenticationTokenSelector } from '../selectors/global';
import { createRecordStart, createRecordSuccess, createRecordError } from '../actions/_utils';
import { makeApiActionCreator } from './utils';
import { zeroPad } from '../utils';

export const CREATE_MEDIA_START_WIZARD = 'CREATE_MEDIA_START_WIZARD';
export const CREATE_MEDIA_SELECT_TAB = 'CREATE_MEDIA_SELECT_TAB';
export const CREATE_MEDIA_SELECT_MEDIA_TYPE = 'CREATE_MEDIA_SELECT_MEDIA_TYPE';
export const CREATE_MEDIA_CANCEL_WIZARD = 'CREATE_MEDIA_CANCEL_WIZARD';

export const CREATE_MEDIA_START = 'MEDIA/CREATE_MEDIA_START';
export const CREATE_MEDIA_SUCCESS = 'MEDIA/CREATE_MEDIA_SUCCESS';
export const CREATE_MEDIA_ERROR = 'MEDIA/CREATE_MEDIA_ERROR';

export const PROCESS_MEDIA_START = 'MEDIA/PROCESS_MEDIA_START';
export const PROCESS_MEDIA_SUCCESS = 'MEDIA/PROCESS_MEDIA_SUCCESS';
export const PROCESS_MEDIA_ERROR = 'MEDIA/PROCESS_MEDIA_ERROR';

export const UPLOAD_FILE_START = 'MEDIA/MEDIA_UPLOAD_FILE_START';
export const UPLOAD_FILE_SUCCESS = 'MEDIA/MEDIA_UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'MEDIA/MEDIA_UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_PROGRESS = 'MEDIA/MEDIA_UPLOAD_FILE_PROGRESS';

export const MEDIA_SEARCH_START = 'MEDIA/MEDIA_SEARCH_START';
export const MEDIA_SEARCH_SUCCESS = 'MEDIA/MEDIA_SEARCH_SUCCESS';
export const MEDIA_SEARCH_ERROR = 'MEDIA/MEDIA_SEARCH_ERROR';

export const DELETE_PROFILE_IMAGE_START = 'MEDIA/DELETE_PROFILE_IMAGE_START';
export const DELETE_PROFILE_IMAGE_SUCCESS = 'MEDIA/DELETE_PROFILE_IMAGE_SUCCESS';
export const DELETE_PROFILE_IMAGE_ERROR = 'MEDIA/DELETE_PROFILE_IMAGE_ERROR';

export const DELETE_POSTER_IMAGE_START = 'MEDIA/DELETE_POSTER_IMAGE_START';
export const DELETE_POSTER_IMAGE_SUCCESS = 'MEDIA/DELETE_POSTER_IMAGE_SUCCESS';
export const DELETE_POSTER_IMAGE_ERROR = 'MEDIA/DELETE_POSTER_IMAGE_ERROR';

export const DELETE_ROUND_LOGO_START = 'MEDIA/DELETE_ROUND_LOGO_START';
export const DELETE_ROUND_LOGO_SUCCESS = 'MEDIA/DELETE_ROUND_LOGO_SUCCESS';
export const DELETE_ROUND_LOGO_ERROR = 'MEDIA/DELETE_ROUND_LOGO_ERROR';

export const DELETE_BANNER_IMAGE_START = 'MEDIA/DELETE_BANNER_IMAGE_START';
export const DELETE_BANNER_IMAGE_SUCCESS = 'MEDIA/DELETE_BANNER_IMAGE_SUCCESS';
export const DELETE_BANNER_IMAGE_ERROR = 'MEDIA/DELETE_BANNER_IMAGE_ERROR';

export const TV_GUIDE_ENTRIES_FETCH_START = 'MEDIA/TV_GUIDE_ENTRIES_FETCH_START';
export const TV_GUIDE_ENTRIES_FETCH_SUCCESS = 'MEDIA/TV_GUIDE_ENTRIES_FETCH_SUCCESS';
export const TV_GUIDE_ENTRIES_FETCH_ERROR = 'MEDIA/TV_GUIDE_ENTRIES_FETCH_ERROR';

export const CROPS_FETCH_START = 'MEDIA/CROPS_FETCH_START';
export const CROPS_FETCH_SUCCESS = 'MEDIA/CROPS_FETCH_SUCCESS';
export const CROPS_FETCH_ERROR = 'MEDIA/CROPS_FETCH_ERROR';

export const MEDIA_FETCH_START = 'MEDIA/MEDIA_FETCH_START';
export const MEDIA_FETCH_SUCCESS = 'MEDIA/MEDIA_FETCH_SUCCESS';
export const MEDIA_FETCH_ERROR = 'MEDIA/MEDIA_FETCH_ERROR';

export const MEDIUM_FETCH_START = 'MEDIA/MEDIUM_FETCH_START';
export const MEDIUM_FETCH_SUCCESS = 'MEDIA/MEDIUM_FETCH_SUCCESS';
export const MEDIUM_FETCH_ERROR = 'MEDIA/MEDIUM_FETCH_ERROR';

export const TOPIC_FETCH_START = 'MEDIA/TOPIC_FETCH_START';
export const TOPIC_FETCH_SUCCESS = 'MEDIA/TOPIC_FETCH_SUCCESS';
export const TOPIC_FETCH_ERROR = 'MEDIA/TOPIC_FETCH_ERROR';

export const fetchTvGuideEntries = makeApiActionCreator(mediaApi.fetchTvGuideEntries, TV_GUIDE_ENTRIES_FETCH_START, TV_GUIDE_ENTRIES_FETCH_SUCCESS, TV_GUIDE_ENTRIES_FETCH_ERROR);
export const fetchCrops = makeApiActionCreator(mediaApi.fetchCrops, CROPS_FETCH_START, CROPS_FETCH_SUCCESS, CROPS_FETCH_ERROR);
export const fetchMedium = makeApiActionCreator(mediaApi.fetchMedium, MEDIUM_FETCH_START, MEDIUM_FETCH_SUCCESS, MEDIUM_FETCH_ERROR);
export const fetchMedia = makeApiActionCreator(mediaApi.fetchMedia, MEDIA_FETCH_START, MEDIA_FETCH_SUCCESS, MEDIA_FETCH_ERROR);
export const searchMedia = makeApiActionCreator(mediaApi.searchMedia, MEDIA_SEARCH_START, MEDIA_SEARCH_SUCCESS, MEDIA_SEARCH_ERROR);
export const deleteProfileImage = makeApiActionCreator(mediaApi.deleteProfileImage, DELETE_PROFILE_IMAGE_START, DELETE_PROFILE_IMAGE_SUCCESS, DELETE_PROFILE_IMAGE_ERROR);
export const deletePosterImage = makeApiActionCreator(mediaApi.deletePosterImage, DELETE_POSTER_IMAGE_START, DELETE_POSTER_IMAGE_SUCCESS, DELETE_POSTER_IMAGE_ERROR);
export const deleteRoundLogo = makeApiActionCreator(mediaApi.deleteRoundLogo, DELETE_ROUND_LOGO_START, DELETE_ROUND_LOGO_SUCCESS, DELETE_ROUND_LOGO_ERROR);
export const fetchTopic = makeApiActionCreator(mediaApi.fetchTopic, TOPIC_FETCH_START, TOPIC_FETCH_SUCCESS, TOPIC_FETCH_ERROR);
/**
 * Opens the create media modal with video upload etc.
 * @return {Object} The action
 */
export function startWizard () {
  return { type: CREATE_MEDIA_START_WIZARD };
}

/**
 * Close the create media modal, reset the form.
 * @return {Object} The action
 */
export function cancelWizard () {
  return async (dispatch) => {
    dispatch({ type: CREATE_MEDIA_CANCEL_WIZARD });
    dispatch(destroy('createMedia'));
  };
}

/**
 * Select a tab in the create media modal.
 * @param {string} tab The name of the tab that is selected (e.g, 'description')
 * @return {string} The action
 */
export function selectTab (tab) {
  return { tab, type: CREATE_MEDIA_SELECT_TAB };
}

/**
 * Select a media type in the description tab of the create media modal.
 * @param {string} mediaType The media type of the video which we want to upload (e.g, 'movie')
 * @return {string} The action
 */
export function selectMediaType (mediaType) {
  return { mediaType, type: CREATE_MEDIA_SELECT_MEDIA_TYPE };
}

/**
 * Request a file upload to the server, then perform a file upload to Amazon.
 * @returnExample {
 *   remoteFilename: 'private/upload/8b1b2b02-3826-48d6-9b1a-87d77d8211c7/testfile.mp4'
 * }
 */
function uploadFile (file) {
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const baseUrl = apiBaseUrlSelector(state);

    dispatch(createRecordStart(UPLOAD_FILE_START));
    try {
      // A callback is provided to dispatch the progress of the file upload.
      // We dispatch UPLOAD_FILE_PROGRESS one time per second, this both to reduce
      // excessive action triggers as well as to provide a more 'calm' UI.
      let lastProgressTriggerTime = 0;
      let records = await mediaApi.postUpload(baseUrl, authenticationToken, { file }, (currentBytes, totalBytes) => {
        let now = new Date().getTime();
        if (now - lastProgressTriggerTime >= 1000) {
          lastProgressTriggerTime = now;
          dispatch({ currentBytes, type: UPLOAD_FILE_PROGRESS, totalBytes });
        }
      });
      dispatch(createRecordSuccess(UPLOAD_FILE_SUCCESS, records, { file }));
      return records;
    } catch (error) {
      dispatch(createRecordError(UPLOAD_FILE_ERROR, error));
      // Throw the error to the parent, because this is a sub action.
      throw error;
    }
  };
}

/**
 * Start asynchronous processing of a video file uploaded to S3 ("the Chain").
 * This call "invokes the chain", by starting an asynchronous thread.
 * @param {object} data
 * @param {string} data.description A textual description of the file to process.
 * @param {string} data.mediumExternalReference The id of the external medium.
 * @param {string} data.mediumExternalReferenceSource The source of the external medium, e.g., 'local' or 's3'.
 * @param {string} data.remoteFilename The name of a file saved on Amazon, as returned
 *                 in field remoteFilename by the uploadFile action.
 * @param {boolean} data.skipAudio Skip the audio processing.
 * @param {boolean} data.skipScenes Skip the scene processing.
 * @returnExample {
 *   requestId: '99f3ec5c-11e6-479a-9d9b-cd3549d905e7',
 *   description: 'test',
 *   outputFilename: 'data/import/input/testfile.mp4.zip'
 * }
 */
export function processMedia ({ description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename, skipAudio, skipScenes }) {
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const baseUrl = apiBaseUrlSelector(state);

    dispatch(createRecordStart(PROCESS_MEDIA_START));
    try {
      const records = await mediaApi.postProcess(baseUrl, authenticationToken, { description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename, skipAudio, skipScenes });
      dispatch(createRecordSuccess(PROCESS_MEDIA_SUCCESS, records, { description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename }));
      return records;
    } catch (error) {
      dispatch(createRecordError(PROCESS_MEDIA_ERROR, error));
      // Throw the error to the parent, because this is a sub action.
      throw error;
    }
  };
}

/**
 * Create a media object.
 * 1) Upload to Amazon S3.
 * 2) Process the video on S3.
 * 3) Link the uploaded video to a medium (series, movie, etc.).
 * @param {object} data
 * @param {number} data.episode The number of the episode, e.g., 1 for the first episode.
 * @param {string} data.episodeTitle The title of the episode, e.g., 'Dogfight'.
 * @param {string} data.mediumExternalReference The id of the external medium.
 * @param {string} data.mediumExternalReferenceSource The source of the external medium, e.g., 'local' or 's3'.
 * @param {number} data.season The number of the season, e.g. 2 for the second season.
 * @param {string} data.seriesName The name of the series, e.g., 'Suits'.
 * @param {boolean} data.skipAudio Skip the audio processing.
 * @param {boolean} data.skipScenes Skip the scene processing.
 * @param {object} data.video A File object containing the video.
 * @return {string} The action
 */
export function createMedia (values) {
  return async (dispatch, getState) => {
    const { episode, episodeTitle, mediumExternalReference, mediumExternalReferenceSource, season, seriesName, skipAudio, skipScenes, video } = values.toJS();
    // A description could be 'Suits S02E01 Dogfight'.
    let description = `${seriesName} S${zeroPad(season)}E${zeroPad(episode)} ${episodeTitle}`;
    try {
      dispatch({ type: CREATE_MEDIA_START, jobName: seriesName });
      // Close create media form.
      dispatch(destroy('createMedia'));
      let { remoteFilename } = await dispatch(uploadFile(video));
      // Stores the requestId in the state to poll the status or retrieve the logs.
      await dispatch(processMedia({ description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename, skipAudio, skipScenes }));
      dispatch({ type: CREATE_MEDIA_SUCCESS });
    } catch (error) {
      dispatch({ error, type: CREATE_MEDIA_ERROR });
    }
  };
}
