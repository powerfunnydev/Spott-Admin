import { searchSeries as dataSearchSeries } from '../../actions/series';

// Action types
// ////////////

export const SERIES_SEARCH_START = 'REPORTING/SERIES_SEARCH_START';
export const SERIES_SEARCH_ERROR = 'REPORTING/SERIES_SEARCH_ERROR';

export function searchSeries (searchString = '') {
  return async (dispatch, getState) => {
    try {
      dispatch({ searchString, type: SERIES_SEARCH_START });
      return await dispatch(dataSearchSeries({ searchString }));
    } catch (error) {
      dispatch({ error, searchString, type: SERIES_SEARCH_ERROR });
    }
  };
}
