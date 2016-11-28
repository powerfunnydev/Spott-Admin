import { fetchSeriesEntry as dataFetchSeriesEntry } from '../../../../actions/series';

export const SERIES_ENTRY_FETCH_ENTRY_ERROR = 'SERIES_ENTRIES_READ/FETCH_ENTRY_ERROR';

export function loadSeriesEntry (seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeriesEntry({ seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_FETCH_ENTRY_ERROR });
    }
  };
}
