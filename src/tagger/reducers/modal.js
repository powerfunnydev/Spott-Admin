import { Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes';

export default (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.MODAL_CLOSE:
      return state.delete('currentModal');
    case actionTypes.MODAL_OPEN_WHAT_TO_TAG:
      return state.set('currentModal', 'whatToTag');
    case actionTypes.MODAL_OPEN_CREATE_PRODUCT_MARKER:
      return state.set('currentModal', 'createProductMarker');
    case actionTypes.MODAL_OPEN_UPDATE_PRODUCT_MARKER:
      return state.set('currentModal', 'updateProductMarker');
    case actionTypes.MODAL_OPEN_CREATE_CHARACTER_MARKER:
      return state.set('currentModal', 'createCharacterMarker');
    case actionTypes.MODAL_OPEN_ADD_APPEARANCE_TO_SIMILAR_FRAMES:
      return state.set('currentModal', 'addAppearanceToSimilarFrames');

    case actionTypes.CREATE_PRODUCT_MARKER_SUCCESS:
    case actionTypes.CREATE_PRODUCT_MARKER_CANCEL:
    case actionTypes.UPDATE_PRODUCT_MARKER_SUCCESS:
    case actionTypes.UPDATE_PRODUCT_MARKER_CANCEL:
    case actionTypes.CREATE_CHARACTER_MARKER_SUCCESS:
    case actionTypes.CREATE_CHARACTER_MARKER_CANCEL:
      return state.delete('currentModal');

    case actionTypes.CREATE_CHARACTER_MARKER_ERROR:
      // The character is already in the scene. Close the modal.
      if (action.error.name === 'BadRequestError' && action.error.code === 'characterAlreadyInScene') {
        return state.delete('currentModal');
      }
      return state;
    default:
      return state;
  }
};
