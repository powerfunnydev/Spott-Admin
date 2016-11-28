import { fetchEpisodes as dataFetchEpisodes,
  deleteEpisode as dataDeleteEpisode,
  deleteEpisodes as dataDeleteEpisodes } from '../../../../actions/episode';

// Action types
// ////////////

export const EPISODE_FETCH_START = 'EPISODES/EPISODE_FETCH_START';
export const EPISODE_FETCH_ERROR = 'EPISODES/EPISODE_FETCH_ERROR';

export const EPISODES_DELETE_ERROR = 'EPISODES/EPISODES_REMOVE_ERROR';
export const EPISODE__DELETE_ERROR = 'EPISODES/EPISODE_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'EPISODES/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'EPISODES/SELECT_CHECKBOX';

export const SORT_COLUMN = 'EPISODES/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchEpisodes(query));
    } catch (error) {
      dispatch({ error, type: EPISODE_FETCH_ERROR });
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

export function deleteEpisode (episodeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteEpisode({ episodeId }));
    } catch (error) {
      dispatch({ error, type: EPISODE__DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
