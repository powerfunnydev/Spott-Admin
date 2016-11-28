import { fetchSeasons as dataFetchSeasons,
  deleteSeason as dataDeleteSeason,
  deleteSeasons as dataDeleteSeasons } from '../../../../actions/season';

// Action types
// ////////////

export const SEASON_FETCH_START = 'SEASONS/SEASON_FETCH_START';
export const SEASON_FETCH_ERROR = 'SEASONS/SEASON_FETCH_ERROR';

export const SEASONS_DELETE_ERROR = 'SEASONS/SEASONS_REMOVE_ERROR';
export const SEASON__DELETE_ERROR = 'SEASONS/SEASON_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'SEASONS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SEASONS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'SEASONS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeasons(query));
    } catch (error) {
      dispatch({ error, type: SEASON_FETCH_ERROR });
    }
  };
}

export function deleteSeasons (seasonIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteSeasons({ seasonIds }));
    } catch (error) {
      dispatch({ error, type: SEASONS_DELETE_ERROR });
    }
  };
}

export function deleteSeason (seasonId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteSeason({ seasonId }));
    } catch (error) {
      dispatch({ error, type: SEASON__DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
