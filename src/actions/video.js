import { makeApiActionCreator } from './utils';
import * as videoApi from '../api/video';
import { authenticationTokenSelector, apiBaseUrlSelector } from '../selectors/global';

export const VIDEO_FETCH_START = 'VIDEO/VIDEO_FETCH_START';
export const VIDEO_FETCH_SUCCESS = 'VIDEO/VIDEO_FETCH_SUCCESS';
export const VIDEO_FETCH_ERROR = 'VIDEO/VIDEO_FETCH_ERROR';

export const VIDEO_PERSIST_START = 'VIDEO/VIDEO_PERSIST_START';
export const VIDEO_PERSIST_SUCCESS = 'VIDEO/VIDEO_PERSIST_SUCCESS';
export const VIDEO_PERSIST_ERROR = 'VIDEO/VIDEO_PERSIST_ERROR';

export const UPLOAD_FILE_START = 'VIDEO/UPLOAD_FILE_START';
export const UPLOAD_FILE_SUCCESS = 'VIDEO/UPLOAD_FILE_SUCCESS';
export const UPLOAD_FILE_ERROR = 'VIDEO/UPLOAD_FILE_ERROR';

export const PROCESS_VIDEO_START = 'PROCESS_VIDEO_START';
export const PROCESS_VIDEO_SUCCESS = 'PROCESS_VIDEO_SUCCESS';
export const PROCESS_VIDEO_ERROR = 'PROCESS_VIDEO_ERROR';

export const VIDEO_PROCESSORS_FETCH_START = 'VIDEO/VIDEO_PROCESSORS_FETCH_START';
export const VIDEO_PROCESSORS_FETCH_SUCCESS = 'VIDEO/VIDEO_PROCESSORS_FETCH_SUCCESS';
export const VIDEO_PROCESSORS_FETCH_ERROR = 'VIDEO/VIDEO_PROCESSORS_FETCH_ERROR';

export const VIDEO_PROCESSOR_LOG_FETCH_START = 'VIDEO/VIDEO_PROCESSOR_LOG_FETCH_START';
export const VIDEO_PROCESSOR_LOG_FETCH_SUCCESS = 'VIDEO/VIDEO_PROCESSOR_LOG_FETCH_SUCCESS';
export const VIDEO_PROCESSOR_LOG_FETCH_ERROR = 'VIDEO/VIDEO_PROCESSOR_LOG_FETCH_ERROR';

export const fetchVideo = makeApiActionCreator(videoApi.getVideo, VIDEO_FETCH_START, VIDEO_FETCH_SUCCESS, VIDEO_FETCH_ERROR);
export const persistVideo = makeApiActionCreator(videoApi.persistVideo, VIDEO_PERSIST_START, VIDEO_PERSIST_SUCCESS, VIDEO_PERSIST_ERROR);
export const fetchVideoProcessors = makeApiActionCreator(videoApi.fetchVideoProcessors, VIDEO_PROCESSORS_FETCH_START, VIDEO_PROCESSORS_FETCH_SUCCESS, VIDEO_PROCESSORS_FETCH_ERROR);
export const fetchVideoProcessorLog = makeApiActionCreator(videoApi.fetchVideoProcessorLog, VIDEO_PROCESSOR_LOG_FETCH_START, VIDEO_PROCESSOR_LOG_FETCH_SUCCESS, VIDEO_PROCESSOR_LOG_FETCH_ERROR);
/**
 * Requests a file upload to the server, then perform a file upload to Amazon.
 * @returnExample {
 *   remoteFilename: 'private/upload/8b1b2b02-3826-48d6-9b1a-87d77d8211c7/testfile.mp4'
 * }
 */
export function uploadFile (file, callback) {
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const baseUrl = apiBaseUrlSelector(state);

    dispatch({ type: UPLOAD_FILE_START });
    try {
      // A callback is provided to dispatch the progress of the file upload.
      // We dispatch UPLOAD_FILE_PROGRESS one time per second, this both to reduce
      // excessive action triggers as well as to provide a more 'calm' UI.
      let lastProgressTriggerTime = 0;
      const data = await videoApi.postUpload(baseUrl, authenticationToken, { file }, (currentBytes, totalBytes) => {
        const now = new Date().getTime();
        if (now - lastProgressTriggerTime >= 1000) {
          lastProgressTriggerTime = now;
          return callback(currentBytes, totalBytes);
        }
      });
      dispatch({ data, file, type: UPLOAD_FILE_SUCCESS });
      return data;
    } catch (error) {
      dispatch({ error, type: UPLOAD_FILE_ERROR });
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
 * @param {string} data.externalReference The id of the external medium.
 * @param {string} data.externalReferenceSource The source of the external medium, e.g., 'local' or 's3'.
 * @param {string} data.remoteFilename The name of a file saved on Amazon, as returned
 *                 in field remoteFilename by the uploadFile action.
 * @param {boolean} data.processAudio Enable audio processing.
 * @param {boolean} data.processScenes Enable scene processing.
 * @returnExample {
 *   requestId: '99f3ec5c-11e6-479a-9d9b-cd3549d905e7',
 *   description: 'test',
 *   outputFilename: 'data/import/input/testfile.mp4.zip'
 * }
 */
export function processVideo ({ description, externalReference, externalReferenceSource, remoteFilename, processAudio, processScenes }) {
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const baseUrl = apiBaseUrlSelector(state);

    dispatch({ type: PROCESS_VIDEO_START });
    try {
      const data = await videoApi.postProcess(baseUrl, authenticationToken, { description, externalReference, externalReferenceSource, processAudio, processScenes, remoteFilename });
      dispatch({ data, type: PROCESS_VIDEO_SUCCESS });
    } catch (error) {
      dispatch({ error, type: PROCESS_VIDEO_ERROR });
      // Throw the error to the parent, because this is a sub action.
      throw error;
    }
  };
}
