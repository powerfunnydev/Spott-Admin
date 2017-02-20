import { persistMovie, fetchMovie as dataFetchMovie } from '../../../../actions/movie';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchCharacters as dataSearchCharacters, searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';
import { searchMediumCategories as dataSearchMediumCategories } from '../../../../actions/mediumCategory';
import { searchShops as dataSearchShops } from '../../../../actions/shop';
import { searchProducts as dataSearchProducts } from '../../../../actions/product';
import { fetchCountries } from '../../../../actions/country';
import { fetchLanguages } from '../../../../actions/language';
import { createSearchAction } from '../../../../utils';

export { uploadProfileImage, uploadPosterImage, uploadRoundLogo } from '../../../../actions/movie';
export { deleteProfileImage, deletePosterImage, deleteRoundLogo } from '../../../../actions/media';
export { openModal, closeModal } from '../../../../actions/global';

export const HELPERS_BRANDS_SEARCH_START = 'MOVIE_EDIT/HELPERS_BRANDS_SEARCH_START';
export const HELPERS_BRANDS_SEARCH_ERROR = 'MOVIE_EDIT/HELPERS_BRANDS_SEARCH_ERROR';

export const HELPERS_CHARACTERS_SEARCH_START = 'MOVIE_EDIT/HELPERS_CHARACTERS_SEARCH_START';
export const HELPERS_CHARACTERS_SEARCH_ERROR = 'MOVIE_EDIT/HELPERS_CHARACTERS_SEARCH_ERROR';

export const HELPERS_SHOPS_SEARCH_START = 'MOVIE_EDIT/HELPERS_SHOPS_SEARCH_START';
export const HELPERS_SHOPS_SEARCH_ERROR = 'MOVIE_EDIT/HELPERS_SHOPS_SEARCH_ERROR';

export const COLLECTIONS_BRANDS_SEARCH_START = 'MOVIE_EDIT/COLLECTIONS_BRANDS_SEARCH_START';
export const COLLECTIONS_BRANDS_SEARCH_ERROR = 'MOVIE_EDIT/COLLECTIONS_BRANDS_SEARCH_ERROR';

export const COLLECTIONS_CHARACTERS_SEARCH_START = 'MOVIE_EDIT/COLLECTIONS_CHARACTERS_SEARCH_START';
export const COLLECTIONS_CHARACTERS_SEARCH_ERROR = 'MOVIE_EDIT/COLLECTIONS_CHARACTERS_SEARCH_ERROR';

export const COLLECTIONS_PRODUCTS_SEARCH_START = 'MOVIE_EDIT/COLLECTIONS_PRODUCTS_SEARCH_START';
export const COLLECTIONS_PRODUCTS_SEARCH_ERROR = 'MOVIE_EDIT/COLLECTIONS_PRODUCTS_SEARCH_ERROR';

export const MEDIUM_HELPERS_CHARACTERS_SEARCH_ERROR = 'MOVIE_EDIT/MEDIUM_HELPERS_CHARACTERS_SEARCH_ERROR';

export const CONTENT_PRODUCERS_SEARCH_START = 'MOVIE_EDIT/CONTENT_PRODUCERS_SEARCH_START';
export const CONTENT_PRODUCERS_SEARCH_ERROR = 'MOVIE_EDIT/CONTENT_PRODUCERS_SEARCH_ERROR';

export const MEDIUM_CATEGORIES_SEARCH_START = 'MOVIE_EDIT/MEDIUM_CATEGORIES_SEARCH_START';
export const MEDIUM_CATEGORIES_SEARCH_ERROR = 'MOVIE_EDIT/MEDIUM_CATEGORIES_SEARCH_ERROR';

export const BROADCASTERS_SEARCH_START = 'MOVIE_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'MOVIE_EDIT/BROADCASTERS_SEARCH_ERROR';

export const MOVIE_PERSIST_ERROR = 'MOVIE_EDIT/MOVIE_PERSIST_ERROR';
export const MOVIE_FETCH_ENTRY_ERROR = 'MOVIE_EDIT/FETCH_ENTRY_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'MOVIE_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'MOVIE_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CLOSE_POP_UP_MESSAGE = 'MOVIE_EDIT/CLOSE_POP_UP_MESSAGE';

export const AUDIENCE_COUNTRIES_SEARCH_START = 'MOVIE_EDIT/AUDIENCE_COUNTRIES_SEARCH_START';
export const AUDIENCE_COUNTRIES_SEARCH_ERROR = 'MOVIE_EDIT/AUDIENCE_COUNTRIES_SEARCH_ERROR';

export const AUDIENCE_LANGUAGES_SEARCH_START = 'MOVIE_EDIT/AUDIENCE_LANGUAGES_SEARCH_START';
export const AUDIENCE_LANGUAGES_SEARCH_ERROR = 'MOVIE_EDIT/AUDIENCE_LANGUAGES_SEARCH_ERROR';

export const submit = persistMovie;

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

// Collections
// ///////////

/* Search on all brands. Can change in the future to medium brands. */
export function searchCollectionsBrands (searchString) {
  return async (dispatch) => {
    try {
      await dispatch({ type: COLLECTIONS_BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: COLLECTIONS_BRANDS_SEARCH_ERROR });
    }
  };
}

/* Search on the cast of a medium. */
export function searchCollectionsCharacters (mediumId, searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: COLLECTIONS_CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchMediumCharacters({ mediumId, searchString }));
    } catch (error) {
      dispatch({ error, type: COLLECTIONS_CHARACTERS_SEARCH_ERROR });
    }
  };
}

/* Search on all products. */
export function searchCollectionsProducts (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: COLLECTIONS_PRODUCTS_SEARCH_START, searchString });
      return await dispatch(dataSearchProducts({ searchString }));
    } catch (error) {
      dispatch({ error, type: COLLECTIONS_PRODUCTS_SEARCH_ERROR });
    }
  };
}

// Helpers
// ///////

/* Search on all characters. */
export function searchHelpersCharacters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: HELPERS_CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchCharacters({ searchString }));
    } catch (error) {
      dispatch({ error, type: HELPERS_CHARACTERS_SEARCH_ERROR });
    }
  };
}

/* Search on all brands. */
export function searchHelpersBrands (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: HELPERS_BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: HELPERS_BRANDS_SEARCH_ERROR });
    }
  };
}

/* Search on all shops. */
export function searchHelpersShops (searchString) {
  return async (dispatch) => {
    try {
      await dispatch({ type: HELPERS_SHOPS_SEARCH_START, searchString });
      return await dispatch(dataSearchShops({ searchString }));
    } catch (error) {
      dispatch({ error, type: HELPERS_SHOPS_SEARCH_ERROR });
    }
  };
}

// Audience
// ////////

export const searchAudienceCountries = createSearchAction(fetchCountries, AUDIENCE_COUNTRIES_SEARCH_START, AUDIENCE_COUNTRIES_SEARCH_ERROR);
export const searchAudienceLanguages = createSearchAction(fetchLanguages, AUDIENCE_LANGUAGES_SEARCH_START, AUDIENCE_LANGUAGES_SEARCH_ERROR);
