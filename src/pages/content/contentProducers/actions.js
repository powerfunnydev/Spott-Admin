import { fetchContentProducers as dataFetchContentProducers } from '../../../actions/contentProducers';

export const sortDirections = {
  ASC: 1,
  DESC: 2
};
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

export function directionToString (direction) {
  if (direction === ASC) {
    return 'ASC';
  } else if (direction === DESC) {
    return 'DESC';
  }
  return '';
}

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
