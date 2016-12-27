import { fetchSeriesEntryEpisodes as dataFetchSeriesEntryEpisodes } from '../../../../../actions/series';
import { deleteEpisodes as dataDeleteEpisodes, deleteEpisode as dataDeleteEpisode } from '../../../../../actions/episode';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix, filterArray } from './index';

export const SELECT_ALL_CHECKBOXES = 'SERIES_ENTRY_EPISODES_READ/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SERIES_ENTRY_EPISODES_READ/SELECT_CHECKBOX';

export const SERIES_ENTRY_EPISODES_FETCH_ENTRY_ERROR = 'SERIES_ENTRY_EPISODES_READ/SERIES_ENTRY_EPISODES_FETCH_ENTRY_ERROR';
export const EPISODE_DELETE_ERROR = 'SERIES_ENTRY_EPISODES_READ/EPISODE_DELETE_ERROR';
export const EPISODES_DELETE_ERROR = 'SERIES_ENTRY_EPISODES_READ/EPISODES_DELETE_ERROR';

export function loadEpisodes (query, seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeriesEntryEpisodes({ ...getInformationFromQuery(query, prefix, filterArray), seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_EPISODES_FETCH_ENTRY_ERROR });
    }
  };
}

export function deleteEpisode (episodeId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataDeleteEpisode({ episodeId }));
    } catch (error) {
      dispatch({ error, type: EPISODE_DELETE_ERROR });
    }
  };
}

export function deleteEpisodes (episodeIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteEpisodes({ episodeIds }));
    } catch (error) {
      dispatch({ error, type: EPISODES_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
