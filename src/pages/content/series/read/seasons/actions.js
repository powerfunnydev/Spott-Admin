import { fetchSeriesEntrySeasons as dataFetchSeriesEntrySeasons } from '../../../../../actions/series';
import { deleteSeason as dataDeleteSeason } from '../../../../../actions/season';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

export const SELECT_ALL_CHECKBOXES = 'SERIES_ENTRY_SEASONS_READ/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SERIES_ENTRY_SEASONS_READ/SELECT_CHECKBOX';

export const SERIES_ENTRY_SEASONS_FETCH_ENTRY_ERROR = 'SERIES_ENTRY_SEASONS_READ/SERIES_ENTRY_SEASONS_FETCH_ENTRY_ERROR';
export const SEASON_DELETE_ENTRY_ERROR = 'SERIES_ENTRY_SEASONS_READ/SEASON_DELETE_ENTRY_ERROR';

export function loadSeasons (query, seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeriesEntrySeasons({ ...getInformationFromQuery(query, prefix), seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_SEASONS_FETCH_ENTRY_ERROR });
    }
  };
}

export function deleteSeason (seasonId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataDeleteSeason({ seasonId }));
    } catch (error) {
      dispatch({ error, type: SEASON_DELETE_ENTRY_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
