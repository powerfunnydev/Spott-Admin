import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { persistSpott, fetchSpott as dataFetchSpott } from '../../../../actions/spott';
import { searchTopics as dataSearchTopics } from '../../../../actions/topic';
import { fetchCountries } from '../../../../actions/country';
import { searchCharacters as dataSearchCharacters } from '../../../../actions/character';
import { searchPersons as dataSearchPersons } from '../../../../actions/person';
import { searchProducts as dataSearchProducts } from '../../../../actions/product';
import { searchUsers as dataSearchUsers } from '../../../../actions/user';
import { fetchLanguages } from '../../../../actions/language';
import { createSearchAction } from '../../../../utils';

export const BRANDS_SEARCH_START = 'SPOTTS_EDIT/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'SPOTTS_EDIT/BRANDS_SEARCH_ERROR';

export const SPOTT_FETCH_ENTRY_ERROR = 'SPOTTS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'SPOTTS_EDIT/CLOSE_POP_UP_MESSAGE';

export const TOPICS_SEARCH_START = 'SPOTT_EDIT/TOPICS_SEARCH_START';
export const TOPICS_SEARCH_ERROR = 'SPOTT_EDIT/TOPICS_SEARCH_ERROR';

export const TAGS_CHARACTERS_SEARCH_START = 'SPOTTS_EDIT/TAGS_CHARACTERS_SEARCH_START';
export const TAGS_CHARACTERS_SEARCH_ERROR = 'SPOTTS_EDIT/TAGS_CHARACTERS_SEARCH_ERROR';

export const TAGS_PERSONS_SEARCH_START = 'SPOTTS_EDIT/TAGS_PERSONS_SEARCH_START';
export const TAGS_PERSONS_SEARCH_ERROR = 'SPOTTS_EDIT/TAGS_PERSONS_SEARCH_ERROR';

export const TAGS_PRODUCTS_SEARCH_START = 'SPOTTS_EDIT/TAGS_PRODUCTS_SEARCH_START';
export const TAGS_PRODUCTS_SEARCH_ERROR = 'SPOTTS_EDIT/TAGS_PRODUCTS_SEARCH_ERROR';

export const AUDIENCE_COUNTRIES_SEARCH_START = 'SPOTTS_EDIT/AUDIENCE_COUNTRIES_SEARCH_START';
export const AUDIENCE_COUNTRIES_SEARCH_ERROR = 'SPOTTS_EDIT/AUDIENCE_COUNTRIES_SEARCH_ERROR';

export const AUDIENCE_LANGUAGES_SEARCH_START = 'SPOTTS_EDIT/AUDIENCE_LANGUAGES_SEARCH_START';
export const AUDIENCE_LANGUAGES_SEARCH_ERROR = 'SPOTTS_EDIT/AUDIENCE_LANGUAGES_SEARCH_ERROR';

export const USERS_SEARCH_START = 'LINK_USER_MODAL/USERS_SEARCH_START';
export const USERS_SEARCH_ERROR = 'LINK_USER_MODAL/USERS_SEARCH_ERROR';

export { openModal, closeModal } from '../../../../actions/global';

export { persistTopic } from '../../../../actions/topic';
export { fetchTopic as fetchPersonTopic } from '../../../../actions/person';
export { fetchTopic as fetchBrandTopic } from '../../../../actions/brand';
export { fetchTopic as fetchCharacterTopic } from '../../../../actions/character';

export const submit = persistSpott;

export const searchTopics = createSearchAction(dataSearchTopics, TOPICS_SEARCH_START, TOPICS_SEARCH_ERROR);

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadSpott (spottId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSpott({ spottId }));
    } catch (error) {
      dispatch({ error, type: SPOTT_FETCH_ENTRY_ERROR });
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

// Tags
// ////

export const searchCharacters = createSearchAction(dataSearchCharacters, TAGS_CHARACTERS_SEARCH_START, TAGS_CHARACTERS_SEARCH_ERROR);
export const searchPersons = createSearchAction(dataSearchPersons, TAGS_PERSONS_SEARCH_START, TAGS_PERSONS_SEARCH_ERROR);
export const searchProducts = createSearchAction(dataSearchProducts, TAGS_PRODUCTS_SEARCH_START, TAGS_PRODUCTS_SEARCH_ERROR);

// Audience
// ////////

export const searchAudienceCountries = createSearchAction(fetchCountries, AUDIENCE_COUNTRIES_SEARCH_START, AUDIENCE_COUNTRIES_SEARCH_ERROR);
export const searchAudienceLanguages = createSearchAction(fetchLanguages, AUDIENCE_LANGUAGES_SEARCH_START, AUDIENCE_LANGUAGES_SEARCH_ERROR);

// User
// ////

export function searchUsers (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: USERS_SEARCH_START, searchString });
      return await dispatch(dataSearchUsers({ searchString }));
    } catch (error) {
      dispatch({ error, type: USERS_SEARCH_ERROR });
    }
  };
}
