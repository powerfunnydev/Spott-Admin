import { fetchContentProducers as dataFetchContentProducers,
  deleteContentProducerEntry as dataDeleteContentProducerEntry,
  deleteContentProducerEntries as dataDeleteContentProducerEntries } from '../../../../actions/contentProducer';

// Action types
// ////////////

export const CONTENT_PRODUCER_FETCH_START = 'CONTENT_PRODUCER/CONTENT_PRODUCER_FETCH_START';
export const CONTENT_PRODUCER_FETCH_ERROR = 'CONTENT_PRODUCER/CONTENT_PRODUCER_FETCH_ERROR';

export const CONTENT_PRODUCER_ENTRIES_DELETE_ERROR = 'CONTENT_PRODUCER/CONTENT_PRODUCER_ENTRIES_REMOVE_ERROR';
export const CONTENT_PRODUCER_ENTRY_DELETE_ERROR = 'CONTENT_PRODUCER/CONTENT_PRODUCER_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'CONTENT_PRODUCER/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'CONTENT_PRODUCER/SELECT_CHECKBOX';

export const SORT_COLUMN = 'CONTENT_PRODUCER/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchContentProducers(query));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCER_FETCH_ERROR });
    }
  };
}

export function deleteContentProducerEntries (contentProducerEntryIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteContentProducerEntries({ contentProducerEntryIds }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCER_ENTRIES_DELETE_ERROR });
    }
  };
}

export function deleteContentProducerEntry (contentProducerEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteContentProducerEntry({ contentProducerEntryId }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCER_ENTRY_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
