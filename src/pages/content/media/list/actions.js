import { fetchMedia as dataFetchMedia } from '../../../../actions/media';
import { deleteEpisode } from '../../../../actions/episode';
import { deleteSeason } from '../../../../actions/season';
import { deleteSeriesEntry } from '../../../../actions/series';
import { deleteMovie } from '../../../../actions/movie';
import { deleteCommercial } from '../../../../actions/commercial';
import { MOVIE, EPISODE, COMMERCIAL, SERIE, SEASON } from '../../../../constants/mediumTypes';

// Action types
// ////////////

export const MEDIA_FETCH_START = 'SERIES/MEDIA_FETCH_START';
export const MEDIA_FETCH_ERROR = 'SERIES/MEDIA_FETCH_ERROR';

export const MEDIA_DELETE_ERROR = 'SERIES/MEDIA_REMOVE_ERROR';
export const MEDIUM_DELETE_ERROR = 'SERIES/MEDIA_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'SERIES/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SERIES/SELECT_CHECKBOX';

export const SORT_COLUMN = 'SERIES/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchMedia(query));
    } catch (error) {
      dispatch({ error, type: MEDIA_FETCH_ERROR });
    }
  };
}

export function deleteMedium (mediumId, type) {
  return async (dispatch, getState) => {
    try {
      switch (type) {
        case COMMERCIAL:
          return await dispatch(deleteCommercial({ commercialId: mediumId }));
        case EPISODE:
          return await dispatch(deleteEpisode({ episodeId: mediumId }));
        case MOVIE:
          return await dispatch(deleteMovie({ movieId: mediumId }));
        case SEASON:
          return await dispatch(deleteSeason({ seasonId: mediumId }));
        case SERIE:
          return await dispatch(deleteSeriesEntry({ seriesEntryId: mediumId }));
      }
    } catch (error) {
      dispatch({ error, type: MEDIUM_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
