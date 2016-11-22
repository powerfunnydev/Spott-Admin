import { persistSeriesEntry } from '../../../../actions/series';

export const SERIES_ENTRY_PERSIST_ERROR = 'SERIES_ENTRYCREATE/SERIES_ENTRY_PERSIST_ERROR';

export function submit ({ title, defaultLocale }) {
  return async (dispatch, getState) => {
    try {
      const seriesEntry = {
        defaultLocale,
        defaultTitle: title,
        locales: [ defaultLocale ],
        title: { [defaultLocale]: title },
        basedOnDefaultLocale: { [defaultLocale]: true }
      };
      return await dispatch(persistSeriesEntry(seriesEntry));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_PERSIST_ERROR });
    }
  };
}
