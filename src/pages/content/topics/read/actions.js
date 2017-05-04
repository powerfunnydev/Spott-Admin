import { fetchTopic as dataFetchTopic } from '../../../../actions/topic';

export const TOPIC_FETCH_ERROR = 'TOPIC_READ/FETCH_TOPIC_ERROR';

export function loadTopic (topicId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTopic({ topicId }));
    } catch (error) {
      dispatch({ error, type: TOPIC_FETCH_ERROR });
    }
  };
}
