import { persistMovie, fetchMovie as dataFetchMovie,
      uploadProfileImage as dataUploadProfileImage,
      uploadPosterImage as dataUploadPosterImage } from '../../../../actions/movie';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchCharacters as dataSearchCharacters } from '../../../../actions/character';
import { searchMediumCategories as dataSearchMediumCategories } from '../../../../actions/mediumCategory';

export { deleteProfileImage, deletePosterImage } from '../../../../actions/media';
export { openModal, closeModal } from '../../../../actions/global';

export const CHARACTERS_SEARCH_START = 'MOVIES_EDIT/CHARACTERS_SEARCH_START';
export const CHARACTERS_SEARCH_ERROR = 'MOVIES_EDIT/CHARACTERS_SEARCH_ERROR';

export const MEDIUM_CHARACTERS_SEARCH_ERROR = 'MOVIES_EDIT/MEDIUM_CHARACTERS_SEARCH_ERROR';

export const CONTENT_PRODUCERS_SEARCH_START = 'MOVIES_EDIT/CONTENT_PRODUCERS_SEARCH_START';
export const CONTENT_PRODUCERS_SEARCH_ERROR = 'MOVIES_EDIT/CONTENT_PRODUCERS_SEARCH_ERROR';

export const MEDIUM_CATEGORIES_SEARCH_START = 'MOVIES_EDIT/MEDIUM_CATEGORIES_SEARCH_START';
export const MEDIUM_CATEGORIES_SEARCH_ERROR = 'MOVIES_EDIT/MEDIUM_CATEGORIES_SEARCH_ERROR';

export const BROADCASTERS_SEARCH_START = 'MOVIES_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'MOVIES_EDIT/BROADCASTERS_SEARCH_ERROR';

export const MOVIE_PERSIST_ERROR = 'MOVIES_EDIT/MOVIE_PERSIST_ERROR';
export const MOVIE_FETCH_ENTRY_ERROR = 'MOVIES_EDIT/FETCH_ENTRY_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'MOVIES_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'MOVIES_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CLOSE_POP_UP_MESSAGE = 'MOVIES_EDIT/CLOSE_POP_UP_MESSAGE';

export const submit = persistMovie;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadPosterImage = dataUploadPosterImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadMovie (movieId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchMovie({ movieId }));
    } catch (error) {
      dispatch({ error, type: MOVIE_FETCH_ENTRY_ERROR });
    }
  };
}

export function searchMediumCategories (searchString) {
  return async (dispatch, getState) => {
    try {
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
