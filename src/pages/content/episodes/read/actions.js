import { fetchEpisode as dataFetchEpisode } from '../../../../actions/episode';

export const EPISODE_FETCH_ENTRY_ERROR = 'EPISODE_READ/FETCH_ENTRY_ERROR';

export function loadEpisode (episodeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchEpisode({ episodeId }));
    } catch (error) {
      dispatch({ error, type: EPISODE_FETCH_ENTRY_ERROR });
    }
  };
}
