import { persistCharacter } from '../../../../actions/character';
import { searchPersons as dataSearchPersons } from '../../../../actions/person';

export const CHARACTER_PERSIST_ERROR = 'CHARACTER_CREATE/CHARACTER_PERSIST_ERROR';

export const PERSONS_SEARCH_START = 'CHARACTER_CREATE/PERSONS_SEARCH_START';
export const PERSONS_SEARCH_ERROR = 'CHARACTER_CREATE/PERSONS_SEARCH_ERROR';

export function submit ({ personId, name, defaultLocale }) {
  return async (dispatch, getState) => {
    try {
      const character = {
        personId,
        defaultLocale,
        locales: [ defaultLocale ],
        name: { [defaultLocale]: name },
        basedOnDefaultLocale: { [defaultLocale]: true }
      };
      return await dispatch(persistCharacter(character));
    } catch (error) {
      dispatch({ error, type: CHARACTER_PERSIST_ERROR });
    }
  };
}

export function searchPersons (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: PERSONS_SEARCH_START, searchString });
      return await dispatch(dataSearchPersons({ searchString }));
    } catch (error) {
      dispatch({ error, type: PERSONS_SEARCH_ERROR });
    }
  };
}
