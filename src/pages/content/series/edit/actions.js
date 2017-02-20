import { persistSeriesEntry, fetchSeriesEntry as dataFetchSeriesEntry } from '../../../../actions/series';
import { fetchCountries } from '../../../../actions/country';
import { fetchLanguages } from '../../../../actions/language';
import { createSearchAction } from '../../../../utils';

export { deleteProfileImage, deletePosterImage, deleteRoundLogo } from '../../../../actions/media';

export const SERIES_ENTRY_FETCH_ENTRY_ERROR = 'SERIES_ENTRY_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'SERIES_ENTRY_EDIT/CLOSE_POP_UP_MESSAGE';

export const AUDIENCE_COUNTRIES_SEARCH_START = 'SEASONS_EDIT/AUDIENCE_COUNTRIES_SEARCH_START';
export const AUDIENCE_COUNTRIES_SEARCH_ERROR = 'SEASONS_EDIT/AUDIENCE_COUNTRIES_SEARCH_ERROR';

export const AUDIENCE_LANGUAGES_SEARCH_START = 'SEASONS_EDIT/AUDIENCE_LANGUAGES_SEARCH_START';
export const AUDIENCE_LANGUAGES_SEARCH_ERROR = 'SEASONS_EDIT/AUDIENCE_LANGUAGES_SEARCH_ERROR';

export { uploadProfileImage, uploadPosterImage, uploadRoundLogo } from '../../../../actions/series';
export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistSeriesEntry;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadSeriesEntry (seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSeriesEntry({ seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_FETCH_ENTRY_ERROR });
    }
  };
}

// Audience
// ////////

export const searchAudienceCountries = createSearchAction(fetchCountries, AUDIENCE_COUNTRIES_SEARCH_START, AUDIENCE_COUNTRIES_SEARCH_ERROR);
export const searchAudienceLanguages = createSearchAction(fetchLanguages, AUDIENCE_LANGUAGES_SEARCH_START, AUDIENCE_LANGUAGES_SEARCH_ERROR);
