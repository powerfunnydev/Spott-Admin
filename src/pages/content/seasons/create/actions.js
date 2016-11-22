import { persistSeason } from '../../../../actions/season';
import { searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';

export const SERIES_ENTRIES_SEARCH_START = 'SEASON_CREATE/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'SEASON_CREATE/SERIES_ENTRIES_SEARCH_ERROR';

export function searchSeriesEntries (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: SERIES_ENTRIES_SEARCH_START, searchString });
      return await dispatch(dataSearchSeriesEntries({ searchString }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRIES_SEARCH_ERROR });
    }
  };
}

export const submit = persistSeason;
