import { fetchSeasonEpisodes as dataFetchSeasonEpisodes } from '../../../../../actions/season';
import { deleteEpisode as dataDeleteEpisode } from '../../../../../actions/episode';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

export const SELECT_ALL_CHECKBOXES = 'SEASON_EPISODES_READ/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SEASON_EPISODES_READ/SELECT_CHECKBOX';

export const SEASON_EPISODES_FETCH_ENTRY_ERROR = 'SEASON_EPISODES_READ/SEASON_EPISODES_FETCH_ENTRY_ERROR';
export const EPISODE_DELETE_ENTRY_ERROR = 'SEASON_EPISODES_READ/EPISODE_DELETE_ENTRY_ERROR';

export function loadEpisodes (query, seasonId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeasonEpisodes({ ...getInformationFromQuery(query, prefix), seasonId }));
    } catch (error) {
      dispatch({ error, type: SEASON_EPISODES_FETCH_ENTRY_ERROR });
    }
  };
}

export function deleteEpisode (episodeId) {
  return async (dispatch, getState) => {
    try {
      await dispatch(dataDeleteEpisode({ episodeId }));
    } catch (error) {
      dispatch({ error, type: EPISODE_DELETE_ENTRY_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
