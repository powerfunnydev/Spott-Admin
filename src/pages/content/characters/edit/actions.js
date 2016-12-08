import { persistCharacter, fetchCharacter as dataFetchCharacter,
      uploadProfileImage as dataUploadProfileImage,
      uploadPortraitImage as dataUploadPortraitImage } from '../../../../actions/character';
import { searchActors as dataSearchActors } from '../../../../actions/actor';

export { deletePortraitImage, deleteProfileImage } from '../../../../actions/character';
export const CHARACTER_FETCH_ENTRY_ERROR = 'CHARACTERS_EDIT/FETCH_ENTRY_ERROR';

export const ACTORS_SEARCH_START = 'CHARACTER_EDIT/ACTORS_SEARCH_START';
export const ACTORS_SEARCH_ERROR = 'CHARACTER_EDIT/ACTORS_SEARCH_ERROR';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistCharacter;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadPortraitImage = dataUploadPortraitImage;

export function loadCharacter (characterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCharacter({ characterId }));
    } catch (error) {
      dispatch({ error, type: CHARACTER_FETCH_ENTRY_ERROR });
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
