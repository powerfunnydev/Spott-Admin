import { uploadContentProducerImage, persistContentProducer, fetchContentProducer as dataFetchContentProducer } from '../../../../actions/contentProducer';

export const CONTENT_PRODUCER_FETCH_ERROR = 'CONTENT_PRODUCER_EDIT/FETCH_ERROR';

export const submit = persistContentProducer;
export const uploadImage = uploadContentProducerImage;

export function load (contentProducerId) {
  return async (dispatch, getState) => {
    try {
      const result = await dispatch(dataFetchContentProducer({ contentProducerId }));
      return result;
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCER_FETCH_ERROR });
    }
  };
}
