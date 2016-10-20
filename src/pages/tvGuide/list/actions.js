import { fetchTvGuideEntries as dataFetchTvGuideEntries,
  deleteTvGuideEntry as dataDeleteTvGuideEntry,
  deleteTvGuideEntries as dataDeleteTvGuideEntries } from '../../../actions/tvGuide';

// Action types
// ////////////

export const TV_GUIDE_ENTRIES_FETCH_ERROR = 'TV_GUIDE_LIST/TV_GUIDE_FETCH_ERROR';
export const TV_GUIDE_ENTRIES_FETCH_SUCCESS = 'TV_GUIDE_LIST/TV_GUIDE_FETCH_SUCCESS';

export const TV_GUIDE_ENTRIES_DELETE_ERROR = 'TV_GUIDE_LIST/TV_GUIDE_ENTRIES_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'TV_GUIDE_LIST/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'TV_GUIDE_LIST/SELECT_CHECKBOX';

export const SORT_COLUMN = 'TV_GUIDE_LIST/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTvGuideEntries(query));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_ENTRIES_FETCH_ERROR });
    }
  };
}

export function deleteTvGuideEntries (tvGuideEntryIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteTvGuideEntries({ tvGuideEntryIds }));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_ENTRIES_DELETE_ERROR });
    }
  };
}

export function deleteTvGuideEntry (tvGuideEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteTvGuideEntry(tvGuideEntryId));
    } catch (error) {
      dispatch({ error, type: TV_GUIDE_ENTRIES_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
