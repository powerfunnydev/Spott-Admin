import { fetchCharacter as dataFetchCharacter } from '../../../../actions/character';

export const CHARACTER_FETCH_ERROR = 'CHARACTER_READ/FETCH_CHARACTER_ERROR';

export function loadCharacter (characterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCharacter({ characterId }));
    } catch (error) {
      dispatch({ error, type: CHARACTER_FETCH_ERROR });
    }
  };
}
