import { fetchCharacters as dataFetchCharacters,
  deleteCharacter as dataDeleteCharacter,
  deleteCharacters as dataDeleteCharacters } from '../../../../actions/character';

// Action types
// ////////////

export const CHARACTER_FETCH_START = 'CHARACTERS/CHARACTER_FETCH_START';
export const CHARACTER_FETCH_ERROR = 'CHARACTERS/CHARACTER_FETCH_ERROR';

export const CHARACTERS_DELETE_ERROR = 'CHARACTERS/CHARACTERS_REMOVE_ERROR';
export const CHARACTER_DELETE_ERROR = 'CHARACTERS/CHARACTER_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'CHARACTERS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'CHARACTERS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'CHARACTERS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCharacters(query));
    } catch (error) {
      dispatch({ error, type: CHARACTER_FETCH_ERROR });
    }
  };
}

export function deleteCharacters (characterIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteCharacters({ characterIds }));
    } catch (error) {
      dispatch({ error, type: CHARACTERS_DELETE_ERROR });
    }
  };
}

export function deleteCharacter (characterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteCharacter({ characterId }));
    } catch (error) {
      dispatch({ error, type: CHARACTER_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
