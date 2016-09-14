/* eslint-disable prefer-const */
import { destroy } from 'redux-form/immutable';
import { postProcess, postUpload } from '../api/media';
import { apiBaseUrlSelector, authenticationTokenSelector } from '../selectors/global';
import { createRecordStart, createRecordSuccess, createRecordError } from '../actions/_utils';
import { zeroPad } from '../utils';

export const CREATE_MEDIA_START_WIZARD = 'CREATE_MEDIA_START_WIZARD';
export const CREATE_MEDIA_SELECT_TAB = 'CREATE_MEDIA_SELECT_TAB';
export const CREATE_MEDIA_SELECT_MEDIA_TYPE = 'CREATE_MEDIA_SELECT_MEDIA_TYPE';
export const CREATE_MEDIA_CANCEL_WIZARD = 'CREATE_MEDIA_CANCEL_WIZARD';

export const CREATE_MEDIA_START = 'CREATE_MEDIA_START';
export const CREATE_MEDIA_SUCCESS = 'CREATE_MEDIA_SUCCESS';
export const CREATE_MEDIA_ERROR = 'CREATE_MEDIA_ERROR';

export const PROCESS_MEDIA_START = 'PROCESS_MEDIA_START';
export const PROCESS_MEDIA_SUCCESS = 'PROCESS_MEDIA_SUCCESS';
export const PROCESS_MEDIA_ERROR = 'PROCESS_MEDIA_ERROR';

export const UPLOAD_FILE_START = 'MEDIA_UPLOAD_FILE_START';
export const UPLOAD_FILE_SUCCESS = 'MEDIA_UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'MEDIA_UPLOAD_FILE_ERROR';
export const UPLOAD_FILE_PROGRESS = 'MEDIA_UPLOAD_FILE_PROGRESS';

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
      let records = await postUpload(baseUrl, authenticationToken, { file }, (currentBytes, totalBytes) => {
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
      const records = await postProcess(baseUrl, authenticationToken, { description, mediumExternalReference, mediumExternalReferenceSource, remoteFilename, skipAudio, skipScenes });
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
    console.error('VALUES', values.toJS());
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