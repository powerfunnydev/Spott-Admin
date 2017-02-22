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
import { fetchCountries } from '../../../../actions/country';
import { fetchLanguages } from '../../../../actions/language';
import { createSearchAction } from '../../../../utils';

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

export const AUDIENCE_COUNTRIES_SEARCH_START = 'COMMERCIAL_EDIT/AUDIENCE_COUNTRIES_SEARCH_START';
export const AUDIENCE_COUNTRIES_SEARCH_ERROR = 'COMMERCIAL_EDIT/AUDIENCE_COUNTRIES_SEARCH_ERROR';

export const AUDIENCE_LANGUAGES_SEARCH_START = 'COMMERCIAL_EDIT/AUDIENCE_LANGUAGES_SEARCH_START';
export const AUDIENCE_LANGUAGES_SEARCH_ERROR = 'COMMERCIAL_EDIT/AUDIENCE_LANGUAGES_SEARCH_ERROR';

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

export const searchSeriesEntries = createSearchAction(dataSearchSeriesEntries, SERIES_ENTRIES_SEARCH_START, SERIES_ENTRIES_SEARCH_ERROR);

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

export const searchMediumCategories = createSearchAction(dataSearchMediumCategories, MEDIUM_CATEGORIES_SEARCH_START, MEDIUM_CATEGORIES_SEARCH_ERROR);
export const searchContentProducers = createSearchAction(dataSearchContentProducers, CONTENT_PRODUCERS_SEARCH_START, CONTENT_PRODUCERS_SEARCH_ERROR);
export const searchBroadcasters = createSearchAction(dataSearchBroadcasters, BROADCASTERS_SEARCH_START, BROADCASTERS_SEARCH_ERROR);

// Collections
// ///////////

// Search on all brands. Can change in the future to medium brands.
export const searchCollectionsBrands = createSearchAction(dataSearchBrands, COLLECTIONS_BRANDS_SEARCH_START, COLLECTIONS_BRANDS_SEARCH_ERROR);

// Search on the cast of a medium.
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

// Search on all products.
export const searchCollectionsProducts = createSearchAction(dataSearchProducts, COLLECTIONS_PRODUCTS_SEARCH_START, COLLECTIONS_PRODUCTS_SEARCH_ERROR);

// Helpers
// ////////

// Search on all brands.
export const searchHelpersBrands = createSearchAction(dataSearchBrands, HELPERS_BRANDS_SEARCH_START, HELPERS_BRANDS_SEARCH_ERROR);

export const searchHelpersCharacters = createSearchAction(dataSearchCharacters, HELPERS_CHARACTERS_SEARCH_START, HELPERS_CHARACTERS_SEARCH_ERROR);

// Search on all shops.
export const searchHelpersShops = createSearchAction(dataSearchShops, HELPERS_SHOPS_SEARCH_START, HELPERS_SHOPS_SEARCH_ERROR);

// Audience
// ////////

export const searchAudienceCountries = createSearchAction(fetchCountries, AUDIENCE_COUNTRIES_SEARCH_START, AUDIENCE_COUNTRIES_SEARCH_ERROR);
export const searchAudienceLanguages = createSearchAction(fetchLanguages, AUDIENCE_LANGUAGES_SEARCH_START, AUDIENCE_LANGUAGES_SEARCH_ERROR);
