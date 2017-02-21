import { persistSeason, fetchSeason as dataFetchSeason,
      uploadProfileImage as dataUploadProfileImage,
      uploadPosterImage as dataUploadPosterImage } from '../../../../actions/season';
import { searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';
import { fetchCountries } from '../../../../actions/country';
import { fetchLanguages } from '../../../../actions/language';
import { createSearchAction } from '../../../../utils';

export { deleteProfileImage, deletePosterImage } from '../../../../actions/media';
export { openModal, closeModal } from '../../../../actions/global';

export const SERIES_ENTRIES_SEARCH_START = 'SEASON_EDIT/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'SEASON_EDIT/SERIES_ENTRIES_SEARCH_ERROR';

export const SEASON_PERSIST_ERROR = 'SEASON_EDIT/SEASON_PERSIST_ERROR';
export const SEASON_FETCH_ENTRY_ERROR = 'SEASONS_EDIT/FETCH_ENTRY_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'SEASONS_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'SEASONS_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CLOSE_POP_UP_MESSAGE = 'SEASONS_EDIT/CLOSE_POP_UP_MESSAGE';

export const AUDIENCE_COUNTRIES_SEARCH_START = 'SEASONS_EDIT/AUDIENCE_COUNTRIES_SEARCH_START';
export const AUDIENCE_COUNTRIES_SEARCH_ERROR = 'SEASONS_EDIT/AUDIENCE_COUNTRIES_SEARCH_ERROR';

export const AUDIENCE_LANGUAGES_SEARCH_START = 'SEASONS_EDIT/AUDIENCE_LANGUAGES_SEARCH_START';
export const AUDIENCE_LANGUAGES_SEARCH_ERROR = 'SEASONS_EDIT/AUDIENCE_LANGUAGES_SEARCH_ERROR';

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

export const searchSeriesEntries = createSearchAction(dataSearchSeriesEntries, SERIES_ENTRIES_SEARCH_START, SERIES_ENTRIES_SEARCH_ERROR);

// Audience
// ////////

export const searchAudienceCountries = createSearchAction(fetchCountries, AUDIENCE_COUNTRIES_SEARCH_START, AUDIENCE_COUNTRIES_SEARCH_ERROR);
export const searchAudienceLanguages = createSearchAction(fetchLanguages, AUDIENCE_LANGUAGES_SEARCH_START, AUDIENCE_LANGUAGES_SEARCH_ERROR);
