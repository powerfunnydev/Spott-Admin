import { persistCommercial, fetchCommercial as dataFetchCommercial } from '../../../../actions/commercial';
import { searchBroadcasters as dataSearchBroadcasters } from '../../../../actions/broadcaster';
import { searchContentProducers as dataSearchContentProducers } from '../../../../actions/contentProducer';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { searchCharacters as dataSearchCharacters, searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';
import { searchProducts as dataSearchProducts } from '../../../../actions/product';
import { searchMedia as dataSearchMedia } from '../../../../actions/media';
import { searchPersons as dataSearchPersons } from '../../../../actions/person';
import { fetchCountries } from '../../../../actions/country';
import { fetchLanguages } from '../../../../actions/language';
import { createSearchAction } from '../../../../utils';

export { deleteBannerImage, uploadBannerImage, uploadPosterImage, uploadProfileImage, uploadRoundLogo } from '../../../../actions/commercial';
export { deletePosterImage, deleteProfileImage, deleteRoundLogo } from '../../../../actions/media';

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

export const AUDIENCE_COUNTRIES_SEARCH_START = 'COMMERCIAL_EDIT/AUDIENCE_COUNTRIES_SEARCH_START';
export const AUDIENCE_COUNTRIES_SEARCH_ERROR = 'COMMERCIAL_EDIT/AUDIENCE_COUNTRIES_SEARCH_ERROR';

export const AUDIENCE_LANGUAGES_SEARCH_START = 'COMMERCIAL_EDIT/AUDIENCE_LANGUAGES_SEARCH_START';
export const AUDIENCE_LANGUAGES_SEARCH_ERROR = 'COMMERCIAL_EDIT/AUDIENCE_LANGUAGES_SEARCH_ERROR';

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

export const searchBannerLinkMedia = createSearchAction(dataSearchMedia, BANNER_LINK_MEDIA_SEARCH_START, BANNER_LINK_MEDIA_SEARCH_ERROR);
export const searchBannerLinkBrands = createSearchAction(dataSearchBrands, BANNER_LINK_BRANDS_SEARCH_START, BANNER_LINK_BRANDS_SEARCH_ERROR);
export const searchBannerLinkCharacters = createSearchAction(dataSearchCharacters, BANNER_LINK_CHARACTERS_SEARCH_START, BANNER_LINK_CHARACTERS_SEARCH_ERROR);
export const searchBannerLinkPersons = createSearchAction(dataSearchPersons, BANNER_LINK_PERSONS_SEARCH_START, BANNER_LINK_PERSONS_SEARCH_ERROR);
export const searchBrands = createSearchAction(dataSearchBrands, BRANDS_SEARCH_START, BRANDS_SEARCH_ERROR);
export const searchContentProducers = createSearchAction(dataSearchContentProducers, CONTENT_PRODUCERS_SEARCH_START, CONTENT_PRODUCERS_SEARCH_ERROR);
export const searchBroadcasters = createSearchAction(dataSearchBroadcasters, BROADCASTERS_SEARCH_START, BROADCASTERS_SEARCH_ERROR);

// Search on all characters.
export const searchCharacters = createSearchAction(dataSearchCharacters, CHARACTERS_SEARCH_START, CHARACTERS_SEARCH_ERROR);

// Collections
// ///////////

// Search on all brands. Can change in the future to medium brands.
export const searchCollectionsBrands = createSearchAction(dataSearchBrands, COLLECTIONS_BRANDS_SEARCH_START, COLLECTIONS_BRANDS_SEARCH_ERROR);

// Search on the cast of a medium.
export const searchCollectionsCharacters = createSearchAction(dataSearchMediumCharacters, COLLECTIONS_CHARACTERS_SEARCH_START, COLLECTIONS_CHARACTERS_SEARCH_ERROR);

// Search on all products.
export const searchCollectionsProducts = createSearchAction(dataSearchProducts, COLLECTIONS_PRODUCTS_SEARCH_START, COLLECTIONS_PRODUCTS_SEARCH_ERROR);

// Audience
// ////////

export const searchAudienceCountries = createSearchAction(fetchCountries, AUDIENCE_COUNTRIES_SEARCH_START, AUDIENCE_COUNTRIES_SEARCH_ERROR);
export const searchAudienceLanguages = createSearchAction(fetchLanguages, AUDIENCE_LANGUAGES_SEARCH_START, AUDIENCE_LANGUAGES_SEARCH_ERROR);
