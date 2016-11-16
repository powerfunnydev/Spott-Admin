import { fetchContentProducer as dataFetchContentProducer } from '../../../../actions/contentProducer';

export const CONTENT_PRODUCER_FETCH_ENTRY_ERROR = 'CONTENT_PRODUCERS_READ/FETCH_ENTRY_ERROR';

export function loadContentProducer (contentProducerId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchContentProducer({ contentProducerId }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCER_FETCH_ENTRY_ERROR });
    }
  };
}
