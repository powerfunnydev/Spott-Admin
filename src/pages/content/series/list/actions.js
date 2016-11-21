import { fetchSeriesEntries as dataFetchSeriesEntries,
  deleteSeriesEntry as dataDeleteSeriesEntry,
  deleteSeriesEntries as dataDeleteSeriesEntries } from '../../../../actions/series';

// Action types
// ////////////

export const SERIES_ENRTY_FETCH_START = 'SERIES/SERIES_ENRTY_FETCH_START';
export const SERIES_ENRTY_FETCH_ERROR = 'SERIES/SERIES_ENRTY_FETCH_ERROR';

export const SERIES_ENTRIES_DELETE_ERROR = 'SERIES/SERIES_ENTRIES_REMOVE_ERROR';
export const SERIES_ENRTY__DELETE_ERROR = 'SERIES/SERIES_ENRTY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'SERIES/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SERIES/SELECT_CHECKBOX';

export const SORT_COLUMN = 'SERIES/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeriesEntries(query));
    } catch (error) {
      dispatch({ error, type: SERIES_ENRTY_FETCH_ERROR });
    }
  };
}

export function deleteSeriesEntries (seriesEntryIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteSeriesEntries({ seriesEntryIds }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRIES_DELETE_ERROR });
    }
  };
}

export function deleteSeriesEntry (seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteSeriesEntry({ seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENRTY__DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
