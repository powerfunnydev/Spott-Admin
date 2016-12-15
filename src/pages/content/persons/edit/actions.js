import { persistPerson, fetchPerson as dataFetchPerson,
      uploadProfileImage as dataUploadProfileImage,
      uploadPortraitImage as dataUploadPortraitImage } from '../../../../actions/person';

export { uploadFaceImage, fetchFaceImages, deletePortraitImage, deleteProfileImage, deleteFaceImage } from '../../../../actions/person';

export const PERSON_FETCH_ENTRY_ERROR = 'PERSONS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'SEASONS_EDIT/CLOSE_POP_UP_MESSAGE';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistPerson;
export const uploadProfileImage = dataUploadProfileImage;
export const uploadPortraitImage = dataUploadPortraitImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadPerson (personId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchPerson({ personId }));
    } catch (error) {
      dispatch({ error, type: PERSON_FETCH_ENTRY_ERROR });
    }
  };
}
