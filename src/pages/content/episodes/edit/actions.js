import { persistEpisode, fetchEpisode as dataFetchEpisode,
      uploadProfileImage as dataUploadProfileImage,
      uploadPosterImage as dataUploadPosterImage } from '../../../../actions/episode';
import { searchSeasons as dataSearchSeasons, searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchCharacters as dataSearchCharacters } from '../../../../actions/character';
import { searchMediumCategories as dataSearchMediumCategories } from '../../../../actions/mediumCategory';

export { deleteProfileImage, deletePosterImage } from '../../../../actions/media';
export { openModal, closeModal } from '../../../../actions/global';

export const CHARACTERS_SEARCH_START = 'EPISODE_EDIT/CHARACTERS_SEARCH_START';
export const CHARACTERS_SEARCH_ERROR = 'EPISODE_EDIT/CHARACTERS_SEARCH_ERROR';

export const MEDIUM_CHARACTERS_SEARCH_ERROR = 'EPISODE_EDIT/MEDIUM_CHARACTERS_SEARCH_ERROR';

export const CONTENT_PRODUCERS_SEARCH_START = 'EPISODE_EDIT/CONTENT_PRODUCERS_SEARCH_START';
export const CONTENT_PRODUCERS_SEARCH_ERROR = 'EPISODE_EDIT/CONTENT_PRODUCERS_SEARCH_ERROR';

export const MEDIUM_CATEGORIES_SEARCH_START = 'EPISODE_EDIT/MEDIUM_CATEGORIES_SEARCH_START';
export const MEDIUM_CATEGORIES_SEARCH_ERROR = 'EPISODE_EDIT/MEDIUM_CATEGORIES_SEARCH_ERROR';

export const BROADCASTERS_SEARCH_START = 'EPISODE_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'EPISODE_EDIT/BROADCASTERS_SEARCH_ERROR';

export const SERIES_ENTRIES_SEARCH_START = 'EPISODE_EDIT/SERIES_ENTRIES_SEARCH_START';
export const SERIES_ENTRIES_SEARCH_ERROR = 'EPISODE_EDIT/SERIES_ENTRIES_SEARCH_ERROR';

export const SERIES_ENTRY_SEASONS_SEARCH_START = 'EPISODE_EDIT/SERIES_ENTRY_SEASONS_SEARCH_START';
export const SERIES_ENTRY_SEASONS_SEARCH_ERROR = 'EPISODE_EDIT/SERIES_ENTRY_SEASONS_SEARCH_ERROR';

export const EPISODE_PERSIST_ERROR = 'EPISODE_EDIT/EPISODE_PERSIST_ERROR';
export const EPISODE_FETCH_ENTRY_ERROR = 'EPISODES_EDIT/FETCH_ENTRY_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'EPISODES_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'EPISODES_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CLOSE_POP_UP_MESSAGE = 'EPISODES_EDIT/CLOSE_POP_UP_MESSAGE';

export const submit = persistEpisode;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadPosterImage = dataUploadPosterImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadEpisode (episodeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchEpisode({ episodeId }));
    } catch (error) {
      dispatch({ error, type: EPISODE_FETCH_ENTRY_ERROR });
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

export function searchSeasons (searchString, seriesEntryId) {
  return async (dispatch, getState) => {
    try {
      console.log('seriesEntryId', seriesEntryId);
      await dispatch({ type: SERIES_ENTRY_SEASONS_SEARCH_START, searchString });
      return await dispatch(dataSearchSeasons({ searchString, seriesEntryId }));
    } catch (error) {
      dispatch({ error, type: SERIES_ENTRY_SEASONS_SEARCH_ERROR });
    }
  };
}

export function searchMediumCategories (searchString) {
  return async (dispatch, getState) => {
    try {
      console.log('searchString', searchString);
      await dispatch({ type: MEDIUM_CATEGORIES_SEARCH_START, searchString });
      return await dispatch(dataSearchMediumCategories({ searchString }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_CATEGORIES_SEARCH_ERROR });
    }
  };
}

export function searchContentProducers (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: CONTENT_PRODUCERS_SEARCH_START, searchString });
      return await dispatch(dataSearchContentProducers({ searchString }));
    } catch (error) {
      dispatch({ error, type: CONTENT_PRODUCERS_SEARCH_ERROR });
    }
  };
}
export function searchBroadcasters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BROADCASTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchBroadcasters({ searchString }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_SEARCH_ERROR });
    }
  };
}

/* Search on all characters. */
export function searchCharacters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchCharacters({ searchString }));
    } catch (error) {
      dispatch({ error, type: CHARACTERS_SEARCH_ERROR });
    }
  };
}
