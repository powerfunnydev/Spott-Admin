import { persistSeason, fetchSeason as dataFetchSeason,
      uploadProfileImage as dataUploadProfileImage,
      uploadPosterImage as dataUploadPosterImage } from '../../../../actions/season';
import { searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';
export { deleteProfileImage, deletePosterImage } from '../../../../actions/media';

export { openModal, closeModal } from '../../../../actions/global';

export const SERIES_ENTRIES_SEARCH_START = 'SEASON_EDIT/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'SEASON_EDIT/SERIES_ENTRIES_SEARCH_ERROR';

export const SEASON_PERSIST_ERROR = 'SEASON_EDIT/SEASON_PERSIST_ERROR';
export const SEASON_FETCH_ENTRY_ERROR = 'SEASONS_EDIT/FETCH_ENTRY_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'SEASONS_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'SEASONS_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CLOSE_POP_UP_MESSAGE = 'SEASONS_EDIT/CLOSE_POP_UP_MESSAGE';

export const submit = persistSeason;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadPosterImage = dataUploadPosterImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadSeason (seasonId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeason({ seasonId }));
    } catch (error) {
      dispatch({ error, type: SEASON_FETCH_ENTRY_ERROR });
    }
  };
}

export function searchSeriesEntries (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: SERIES_ENTRIES_SEARCH_START, searchString });
      return await dispatch(dataSearchSeriesEntries({ searchString }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRIES_SEARCH_ERROR });
    }
  };
}
