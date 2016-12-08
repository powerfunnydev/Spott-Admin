import { persistCharacter } from '../../../../actions/character';
import { searchActors as dataSearchActors } from '../../../../actions/actor';

export const CHARACTER_PERSIST_ERROR = 'CHARACTER_CREATE/CHARACTER_PERSIST_ERROR';

export const ACTORS_SEARCH_START = 'CHARACTER_CREATE/ACTORS_SEARCH_START';
export const ACTORS_SEARCH_ERROR = 'CHARACTER_CREATE/ACTORS_SEARCH_ERROR';

export function submit ({ actorId, name, defaultLocale }) {
  return async (dispatch, getState) => {
    try {
      const character = {
        actorId,
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

export function searchActors (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: ACTORS_SEARCH_START, searchString });
      return await dispatch(dataSearchActors({ searchString }));
    } catch (error) {
      dispatch({ error, type: ACTORS_SEARCH_ERROR });
    }
  };
}
