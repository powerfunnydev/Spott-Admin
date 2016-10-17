import { fetchContentProducers as dataFetchContentProducers, fetchSortedContentProducers as dataFetchSortedContentProducers } from '../../../actions/contentProducers';
import { sortFieldSelector } from './selector';
export const NONE = 0;
export const ASC = 1;
export const DESC = 2;

// Action types
// ////////////

export const CONTENT_PRODUCERS_FETCH_START = 'CONTENT_PRODERS/CONTENT_PRODUCERS_FETCH_START';
export const CONTENT_PRODUCERS_FETCH_ERROR = 'CONTENT_PRODERS/CONTENT_PRODUCERS_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'CONTENT_PRODERS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'CONTENT_PRODERS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'CONTENT_PRODERS/SORT_COLUMN';

function directionToString (direction) {
  if (direction === ASC) {
    return 'ASC';
  } else if (direction === DESC) {
    return 'DESC';
  }
  return '';
}

export function loadContentProducers () {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchContentProducers());
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

export function sortColumn (sortField) {
  return async (dispatch, getState) => {
    await dispatch({ type: SORT_COLUMN, sortField });
    const sortDirection = directionToString(sortFieldSelector(getState(), sortField));
    dispatch(dataFetchSortedContentProducers({ sortField, sortDirection }));
  };
}
