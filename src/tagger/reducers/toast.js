import { Map, List } from 'immutable';
import * as actionTypes from '../constants/actionTypes';

function pushError (state, text) {
  return state.push(Map({ type: 'error', text }));
}

// function pushInfo (state, text) {
//   return state.push(Map({ type: 'info', text }));
// }

function pushWarning (state, text) {
  return state.push(Map({ type: 'warning', text }));
}

function pop (state) {
  return state.shift();
}

// TODO: add way more toasts

export default (state = List(), action) => {
  switch (action.type) {
    case actionTypes.CREATE_CHARACTER_MARKER_ERROR:
      if (action.error.name === 'BadRequestError' && action.error.code === 'characterAlreadyInScene') {
        return pushWarning(state, 'Character is already in the scene.');
      }
      return pushError(state, 'Could not add the character to the scene.');
    case actionTypes.CREATE_PRODUCT_MARKER_ERROR:
      return pushError(state, 'Could not add the product to the scene.');
    case actionTypes.SUGGEST_PRODUCTS_ERROR:
      return pushError(state, 'Could not retrieve product suggestions.');
    case actionTypes.PRODUCT_OF_SCENE_DELETE_ERROR:
      return pushError(state, 'Could not remove the product from the scene.');
    case actionTypes.PRODUCT_SUGGESTION_ADD_IMAGE_ERROR:
      return pushError(state, 'Could not add the selected region for product suggestion of the specified product.');
    case actionTypes.VIDEO_PRODUCT_DELETE_ERROR:
      return pushError(state, 'Could not remove the global product from the video.');
    case actionTypes.VIDEO_PRODUCTS_FETCH_ERROR:
      return pushError(state, 'Could not retrieve global products.');
    case actionTypes.VIDEO_PRODUCT_PERSIST_ERROR:
      if (action.error.name === 'BadRequestError' && action.error.code && action.error.code.productId === 'alreadyExists') {
        return pushWarning(state, 'Product is already in the video.');
      }
      if (action.videoProduct.appearanceId) {
        return pushError(state, 'Could not update the global product of the video.');
      }
      return pushError(state, 'Could not add the global product to the video.');
    case actionTypes.TOAST_POP:
      return pop(state);
    default:
      return state;
  }
};
