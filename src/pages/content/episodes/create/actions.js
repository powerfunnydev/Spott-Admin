import { persistEpisode } from '../../../../actions/episode';
import { fetchLastEpisode as dataFetchLastEpisode } from '../../../../actions/season';
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
      await dispatch({ type: SERIES_ENTRY_SEASONS_SEARCH_START, searchString });
      return await dispatch(dataSearchSeasons({ searchString, seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_SEASONS_SEARCH_ERROR });
    }
  };
}

export function fetchLastEpisode (seasonId) {
  return dataFetchLastEpisode({ seasonId });
}

export function submit ({ broadcasters, contentProducers, defaultLocale, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      // contains defaultLocale (from previous), locales, number (from previous) , basedOnDefaultLocale, hasTitle
      // seasonId, seriesEntryId, broadcasters (from previous), lastEpisodeId and content producers (from previous)
      const seriesEntry = {
        ...restProps,
        broadcasters: broadcasters && broadcasters.map((bc) => bc.id),
        contentProducers: contentProducers && contentProducers.map((cp) => cp.id),
        defaultLocale,
        locales: [ defaultLocale ],
        basedOnDefaultLocale: { [defaultLocale]: false },
        hasTitle: { [defaultLocale]: false }
      };
      return await dispatch(persistEpisode(seriesEntry));
    } catch (error) {
      dispatch({ error, type: EPISODE_PERSIST_ERROR });
    }
  };
}
