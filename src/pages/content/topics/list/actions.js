import {
  fetchTopics as dataFetchTopics,
  deleteTopic as dataDeleteTopic,
  deleteTopics as dataDeleteTopics
} from '../../../../actions/topic';

// Action types
// ////////////

export const TOPIC_FETCH_START = 'TOPICS/TOPIC_FETCH_START';
export const TOPIC_FETCH_ERROR = 'TOPICS/TOPIC_FETCH_ERROR';

export const TOPIC_DELETE_ERROR = 'TOPICS/TOPIC_DELETE_ERROR';
export const TOPICS_DELETE_ERROR = 'TOPICS/TOPICS_DELETE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'TOPICS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'TOPICS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'TOPICS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      if (query.sourceTypesFilter && typeof query.sourceTypesFilter === 'string') {
        query.sourceTypesFilter = [ query.sourceTypesFilter ]; // convert query.sourceTypesFilter into an array.
      }
      return await dispatch(dataFetchTopics(query));
    } catch (error) {
      console.warn(error);
      dispatch({ error, type: TOPIC_FETCH_ERROR });
    }
  };
}

export function deleteTopic (topicId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteTopic({ topicId }));
    } catch (error) {
      dispatch({ error, type: TOPIC_DELETE_ERROR });
    }
  };
}

export function deleteTopics (topicIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteTopics({ topicIds }));
    } catch (error) {
      dispatch({ error, type: TOPICS_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
