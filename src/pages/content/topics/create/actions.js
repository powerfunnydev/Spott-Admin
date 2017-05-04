import { persistTopic } from '../../../../actions/topic';

export const TOPIC_PERSIST_ERROR = 'TOPIC_CREATE/TOPIC_PERSIST_ERROR';

export function submit ({ text }) {
  return async (dispatch, getState) => {
    try {
      const topic = { text };
      return await dispatch(persistTopic(topic));
    } catch (error) {
      dispatch({ error, type: TOPIC_PERSIST_ERROR });
    }
  };
}
