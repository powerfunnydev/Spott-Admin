import { searchCharacters as dataSearchCharacters } from '../../../../actions/character';
import { searchPersons as dataSearchPersons } from '../../../../actions/person';
import { searchProducts as dataSearchProducts } from '../../../../actions/product';
import { searchUsers as dataSearchUsers } from '../../../../actions/user';
import { persistSpott } from '../../../../actions/spott';
import { searchTopics as dataSearchTopics } from '../../../../actions/topic';
import { createSearchAction } from '../../../../utils';

export const TAGS_CHARACTERS_SEARCH_START = 'SPOTTS_EDIT/TAGS_CHARACTERS_SEARCH_START';
export const TAGS_CHARACTERS_SEARCH_ERROR = 'SPOTTS_EDIT/TAGS_CHARACTERS_SEARCH_ERROR';

export const TAGS_PERSONS_SEARCH_START = 'SPOTTS_EDIT/TAGS_PERSONS_SEARCH_START';
export const TAGS_PERSONS_SEARCH_ERROR = 'SPOTTS_EDIT/TAGS_PERSONS_SEARCH_ERROR';

export const USERS_SEARCH_START = 'LINK_USER_MODAL/USERS_SEARCH_START';
export const USERS_SEARCH_ERROR = 'LINK_USER_MODAL/USERS_SEARCH_ERROR';

export const TAGS_PRODUCTS_SEARCH_START = 'SPOTTS_EDIT/TAGS_PRODUCTS_SEARCH_START';
export const TAGS_PRODUCTS_SEARCH_ERROR = 'SPOTTS_EDIT/TAGS_PRODUCTS_SEARCH_ERROR';

export const SPOTT_PERSIST_ERROR = 'SPOTT_CREATE/SPOTT_PERSIST_ERROR';
export const TOPICS_SEARCH_START = 'SPOTT_CREATE/TOPICS_SEARCH_START';
export const TOPICS_SEARCH_ERROR = 'SPOTT_CREATE/TOPICS_SEARCH_ERROR';

export { persistTopic } from '../../../../actions/topic';

export const searchTopics = createSearchAction(dataSearchTopics, TOPICS_SEARCH_START, TOPICS_SEARCH_ERROR);

// Tags
// ////

export const searchCharacters = createSearchAction(dataSearchCharacters, TAGS_CHARACTERS_SEARCH_START, TAGS_CHARACTERS_SEARCH_ERROR);
export const searchPersons = createSearchAction(dataSearchPersons, TAGS_PERSONS_SEARCH_START, TAGS_PERSONS_SEARCH_ERROR);
export const searchProducts = createSearchAction(dataSearchProducts, TAGS_PRODUCTS_SEARCH_START, TAGS_PRODUCTS_SEARCH_ERROR);

export function submit ({ comment, defaultLocale, title, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const spott = {
        ...restProps,
        comment: { [defaultLocale]: comment },
        title: { [defaultLocale]: title },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistSpott(spott));
    } catch (error) {
      dispatch({ error, type: SPOTT_PERSIST_ERROR });
    }
  };
}

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
