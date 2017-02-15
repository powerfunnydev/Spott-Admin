import { persistCommercial, fetchCommercial as dataFetchCommercial } from '../../../../actions/commercial';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { searchCharacters as dataSearchCharacters, searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';
import { searchProducts as dataSearchProducts } from '../../../../actions/product';
import { searchMedia as dataSearchMedia } from '../../../../actions/media';
import { searchPersons as dataSearchPersons } from '../../../../actions/person';

export { deleteBannerImage, uploadBannerImage, uploadProfileImage, uploadRoundLogo } from '../../../../actions/commercial';
export { deleteProfileImage, deleteRoundLogo } from '../../../../actions/media';

export { openModal, closeModal } from '../../../../actions/global';

export const BANNER_LINK_MEDIA_SEARCH_START = 'COMMERCIAL_EDIT/BANNER_LINK_MEDIA_SEARCH_START';
export const BANNER_LINK_MEDIA_SEARCH_ERROR = 'COMMERCIAL_EDIT/BANNER_LINK_MEDIA_SEARCH_ERROR';

export const BANNER_LINK_BRANDS_SEARCH_START = 'COMMERCIAL_EDIT/BANNER_LINK_BRANDS_SEARCH_START';
export const BANNER_LINK_BRANDS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BANNER_LINK_BRANDS_SEARCH_ERROR';

export const BANNER_LINK_CHARACTERS_SEARCH_START = 'COMMERCIAL_EDIT/BANNER_LINK_CHARACTERS_SEARCH_START';
export const BANNER_LINK_CHARACTERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BANNER_LINK_CHARACTERS_SEARCH_ERROR';

export const BANNER_LINK_PERSONS_SEARCH_START = 'COMMERCIAL_EDIT/BANNER_LINK_PERSONS_SEARCH_START';
export const BANNER_LINK_PERSONS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BANNER_LINK_PERSONS_SEARCH_ERROR';

export const COLLECTIONS_BRANDS_SEARCH_START = 'COMMERCIAL_EDIT/COLLECTIONS_BRANDS_SEARCH_START';
export const COLLECTIONS_BRANDS_SEARCH_ERROR = 'COMMERCIAL_EDIT/COLLECTIONS_BRANDS_SEARCH_ERROR';

export const COLLECTIONS_CHARACTERS_SEARCH_START = 'COMMERCIAL_EDIT/COLLECTIONS_CHARACTERS_SEARCH_START';
export const COLLECTIONS_CHARACTERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/COLLECTIONS_CHARACTERS_SEARCH_ERROR';

export const COLLECTIONS_PRODUCTS_SEARCH_START = 'COMMERCIAL_EDIT/COLLECTIONS_PRODUCTS_SEARCH_START';
export const COLLECTIONS_PRODUCTS_SEARCH_ERROR = 'COMMERCIAL_EDIT/COLLECTIONS_PRODUCTS_SEARCH_ERROR';

export const BRANDS_SEARCH_START = 'COMMERCIAL_EDIT/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BRANDS_SEARCH_ERROR';

export const CONTENT_PRODUCERS_SEARCH_START = 'COMMERCIAL_EDIT/CONTENT_PRODUCERS_SEARCH_START';
export const CONTENT_PRODUCERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/CONTENT_PRODUCERS_SEARCH_ERROR';

export const BROADCASTERS_SEARCH_START = 'COMMERCIAL_EDIT/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/BROADCASTERS_SEARCH_ERROR';

export const COMMERCIAL_PERSIST_ERROR = 'COMMERCIAL_EDIT/COMMERCIAL_PERSIST_ERROR';
export const COMMERCIAL_FETCH_ERROR = 'COMMERCIAL_EDIT/COMMERCIAL_FETCH_ERROR';

export const SHOW_CREATE_LANGUAGE_MODAL = 'COMMERCIAL_EDIT/SHOW_CREATE_LANGUAGE_MODAL';
export const REMOVE_CREATE_LANGUAGE_MODAL = 'COMMERCIAL_EDIT/REMOVE_CREATE_LANGUAGE_MODAL';

export const CHARACTERS_SEARCH_START = 'COMMERCIAL_EDIT/CHARACTERS_SEARCH_START';
export const CHARACTERS_SEARCH_ERROR = 'COMMERCIAL_EDIT/CHARACTERS_SEARCH_ERROR';

export const submit = persistCommercial;

export function loadCommercial (commercialId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCommercial({ commercialId }));
    } catch (error) {
      dispatch({ error, type: COMMERCIAL_FETCH_ERROR });
    }
  };
}

export function searchBannerLinkMedia (searchString) {
  return async (dispatch, getState) => {
    try {
      dispatch({ searchString, type: BANNER_LINK_MEDIA_SEARCH_START });
      return await dispatch(dataSearchMedia({ searchString }));
    } catch (error) {
      dispatch({ error, searchString, type: BANNER_LINK_MEDIA_SEARCH_ERROR });
    }
  };
}

export function searchBannerLinkBrands (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BANNER_LINK_BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: BANNER_LINK_BRANDS_SEARCH_ERROR });
    }
  };
}

export function searchBannerLinkCharacters (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BANNER_LINK_CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchCharacters({ searchString }));
    } catch (error) {
      dispatch({ error, type: BANNER_LINK_CHARACTERS_SEARCH_ERROR });
    }
  };
}

export function searchBannerLinkPersons (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BANNER_LINK_PERSONS_SEARCH_START, searchString });
      return await dispatch(dataSearchPersons({ searchString }));
    } catch (error) {
      dispatch({ error, type: BANNER_LINK_PERSONS_SEARCH_ERROR });
    }
  };
}

export function searchBrands (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: BRANDS_SEARCH_ERROR });
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
