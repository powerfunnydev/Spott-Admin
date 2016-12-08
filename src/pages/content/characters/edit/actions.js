import { persistCharacter, fetchCharacter as dataFetchCharacter,
      uploadProfileImage as dataUploadProfileImage,
      uploadPortraitImage as dataUploadPortraitImage } from '../../../../actions/character';
import { searchPersons as dataSearchPersons } from '../../../../actions/person';

export { uploadFaceImage, fetchFaceImages, deletePortraitImage, deleteProfileImage } from '../../../../actions/character';
export const CHARACTER_FETCH_ENTRY_ERROR = 'CHARACTERS_EDIT/FETCH_ENTRY_ERROR';

export const PERSONS_SEARCH_START = 'CHARACTER_EDIT/PERSONS_SEARCH_START';
export const PERSONS_SEARCH_ERROR = 'CHARACTER_EDIT/PERSONS_SEARCH_ERROR';

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
