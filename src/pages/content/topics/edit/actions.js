import { persistTopic, fetchTopic as dataFetchTopic,
      uploadThumbImage as dataUploadThumbImage,
      uploadBackgroundImage as dataUploadBackgroundImage } from '../../../../actions/topic';

export { deleteThumbImage, deleteBackgroundImage } from '../../../../actions/topic';
export const TOPIC_FETCH_ENTRY_ERROR = 'TOPICS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'TOPICS_EDIT/CLOSE_POP_UP_MESSAGE';
export const SET_POP_UP_MESSAGE = 'TOPICS_EDIT/SET_POP_UP_MESSAGE';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistTopic;
export const uploadThumbImage = dataUploadThumbImage;
export const uploadBackgroundImage = dataUploadBackgroundImage;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function setPopUpMessage (popUpMessage) {
  return { type: SET_POP_UP_MESSAGE, popUpMessage };
}

export function loadTopic (topicId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchTopic({ topicId }));
    } catch (error) {
      dispatch({ error, type: TOPIC_FETCH_ENTRY_ERROR });
    }
  };
}
