import {
  persistEpisode, fetchEpisode as dataFetchEpisode,
  uploadProfileImage as dataUploadProfileImage,
  uploadPosterImage as dataUploadPosterImage
} from '../../../../actions/episode';
import { searchSeasons as dataSearchSeasons, searchSeriesEntries as dataSearchSeriesEntries } from '../../../../actions/series';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { searchProducts as dataSearchProducts } from '../../../../actions/product';
import { searchShops as dataSearchShops } from '../../../../actions/shop';
import { searchCharacters as dataSearchCharacters, searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';
import { searchMediumCategories as dataSearchMediumCategories } from '../../../../actions/mediumCategory';

export { deleteProfileImage, deletePosterImage } from '../../../../actions/media';
export { openModal, closeModal } from '../../../../actions/global';

export const HELPERS_BRANDS_SEARCH_START = 'EPISODE_EDIT/HELPERS_BRANDS_SEARCH_START';
export const HELPERS_BRANDS_SEARCH_ERROR = 'EPISODE_EDIT/HELPERS_BRANDS_SEARCH_ERROR';

export const HELPERS_CHARACTERS_SEARCH_START = 'EPISODE_EDIT/HELPERS_CHARACTERS_SEARCH_START';
export const HELPERS_CHARACTERS_SEARCH_ERROR = 'EPISODE_EDIT/HELPERS_CHARACTERS_SEARCH_ERROR';

export const HELPERS_SHOPS_SEARCH_START = 'EPISODE_EDIT/HELPERS_SHOPS_SEARCH_START';
export const HELPERS_SHOPS_SEARCH_ERROR = 'EPISODE_EDIT/HELPERS_SHOPS_SEARCH_ERROR';

export const COLLECTIONS_BRANDS_SEARCH_START = 'EPISODE_EDIT/COLLECTIONS_BRANDS_SEARCH_START';
export const COLLECTIONS_BRANDS_SEARCH_ERROR = 'EPISODE_EDIT/COLLECTIONS_BRANDS_SEARCH_ERROR';

export const COLLECTIONS_CHARACTERS_SEARCH_START = 'EPISODE_EDIT/COLLECTIONS_CHARACTERS_SEARCH_START';
export const COLLECTIONS_CHARACTERS_SEARCH_ERROR = 'EPISODE_EDIT/COLLECTIONS_CHARACTERS_SEARCH_ERROR';

export const COLLECTIONS_PRODUCTS_SEARCH_START = 'EPISODE_EDIT/COLLECTIONS_PRODUCTS_SEARCH_START';
export const COLLECTIONS_PRODUCTS_SEARCH_ERROR = 'EPISODE_EDIT/COLLECTIONS_PRODUCTS_SEARCH_ERROR';

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
// ////////

/* Search on all brands. */
export function searchHelpersBrands (searchString) {
  return async (dispatch) => {
    try {
      await dispatch({ type: HELPERS_BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: HELPERS_BRANDS_SEARCH_ERROR });
    }
  };
}

export function searchHelpersCharacters (searchString) {
  return async (dispatch) => {
    try {
      await dispatch({ type: HELPERS_CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchCharacters({ searchString }));
    } catch (error) {
      dispatch({ error, type: HELPERS_CHARACTERS_SEARCH_ERROR });
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
