import { persistEpisode } from '../../../../actions/episode';
import { searchSeasons as dataSearchSeasons, searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';

export const SERIES_ENTRIES_SEARCH_START = 'SEASON_CREATE/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'SEASON_CREATE/SERIES_ENTRIES_SEARCH_ERROR';

export const SERIES_ENTRY_SEASONS_SEARCH_START = 'SEASON_CREATE/SERIES_ENTRY_SEASONS_SEARCH_START';
export const SERIES_ENTRY_SEASONS_SEARCH_ERROR = 'SEASON_CREATE/SERIES_ENTRY_SEASONS_SEARCH_ERROR';

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

export function searchSeasons (searchString, seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      console.log('seriesEntryId', seriesEntryId);
      await dispatch({ type: SERIES_ENTRY_SEASONS_SEARCH_START, searchString });
      return await dispatch(dataSearchSeasons({ searchString, seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_SEASONS_SEARCH_ERROR });
    }
  };
}

export const submit = persistEpisode;
