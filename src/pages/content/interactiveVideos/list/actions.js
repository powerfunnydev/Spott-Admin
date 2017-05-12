import { fetchVideoProcessors as datafetchVideoProcessors, fetchVideoProcessorLog } from '../../../../actions/video';

// Action types
// ////////////

export const VIDEO_PROCESSORS_FETCH_START = 'INTERACTIVE_VIDEO/PUSH_NOTIFICATIONS_FETCH_START';
export const VIDEO_PROCESSORS_FETCH_ERROR = 'INTERACTIVE_VIDEO/PUSH_NOTIFICATIONS_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'INTERACTIVE_VIDEO/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'INTERACTIVE_VIDEO/SELECT_CHECKBOX';

export const SORT_COLUMN = 'INTERACTIVE_VIDEO/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(datafetchVideoProcessors(query));
    } catch (error) {
      dispatch({ error, type: VIDEO_PROCESSORS_FETCH_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}

export function fetchLog (requestId) {
  return fetchVideoProcessorLog({ requestId });
}
