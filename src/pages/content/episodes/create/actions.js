import { persistEpisode } from '../../../../actions/episode';
import { searchSeasons as dataSearchSeasons, searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';

export const SERIES_ENTRIES_SEARCH_START = 'EPISODE_CREATE/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'EPISODE_CREATE/SERIES_ENTRIES_SEARCH_ERROR';

export const SERIES_ENTRY_SEASONS_SEARCH_START = 'EPISODE_CREATE/SERIES_ENTRY_SEASONS_SEARCH_START';
export const SERIES_ENTRY_SEASONS_SEARCH_ERROR = 'EPISODE_CREATE/SERIES_ENTRY_SEASONS_SEARCH_ERROR';

export const EPISODE_PERSIST_ERROR = 'EPISODE_CREATE/EPISODE_PERSIST_ERROR';

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

export function submit ({ seriesEntryId, seasonId, number, defaultLocale }) {
  return async (dispatch, getState) => {
    try {
      const seriesEntry = {
        defaultLocale,
        locales: [ defaultLocale ],
        number,
        basedOnDefaultLocale: { [defaultLocale]: true },
        hasTitle: { [defaultLocale]: false },
        seasonId,
        seriesEntryId
      };
      return await dispatch(persistEpisode(seriesEntry));
    } catch (error) {
      dispatch({ error, type: EPISODE_PERSIST_ERROR });
    }
  };
}
