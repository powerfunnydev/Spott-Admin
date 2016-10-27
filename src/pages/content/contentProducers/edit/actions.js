import { persistContentProducerEntry, fetchContentProducerEntry as dataFetchContentProducerEntry } from '../../../../actions/contentProducer';

export const CONTENT_PRODUCERS_FETCH_ENTRY_ERROR = 'CONTENT_PRODUCERS_EDIT/FETCH_ENTRY_ERROR';

export const submit = persistContentProducerEntry;

export function load (contentProducerEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchContentProducerEntry({ contentProducerEntryId }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCERS_FETCH_ENTRY_ERROR });
    }
  };
}
