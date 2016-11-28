import { fetchSeason as dataFetchSeason } from '../../../../actions/season';

export const SEASON_FETCH_ENTRY_ERROR = 'SEASON_READ/FETCH_ENTRY_ERROR';

export function loadSeason (seasonId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeason({ seasonId }));
    } catch (error) {
      dispatch({ error, type: SEASON_FETCH_ENTRY_ERROR });
    }
  };
}
