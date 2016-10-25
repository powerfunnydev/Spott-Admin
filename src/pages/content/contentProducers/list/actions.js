import { fetchContentProducers as dataFetchContentProducers } from '../../../../actions/contentProducers';

// Action types
// ////////////

export const CONTENT_PRODUCERS_FETCH_START = 'CONTENT_PRODUCERS/CONTENT_PRODUCERS_FETCH_START';
export const CONTENT_PRODUCERS_FETCH_ERROR = 'CONTENT_PRODUCERS/CONTENT_PRODUCERS_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'CONTENT_PRODUCERS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'CONTENT_PRODUCERS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'CONTENT_PRODUCERS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchContentProducers(query));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCERS_FETCH_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
