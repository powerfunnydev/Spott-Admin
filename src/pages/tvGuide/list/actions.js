import { fetchTvGuide as dataFetchTvGuide } from '../../../actions/tvGuide';

// Action types
// ////////////

export const TV_GUIDE_FETCH_START = 'TV_GUIDE/TV_GUIDE_FETCH_START';
export const TV_GUIDE_FETCH_ERROR = 'TV_GUIDE/TV_GUIDE_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'TV_GUIDE/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'TV_GUIDE/SELECT_CHECKBOX';

export const SORT_COLUMN = 'TV_GUIDE/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTvGuide(query));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_FETCH_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
