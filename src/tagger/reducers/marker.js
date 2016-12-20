import { Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes';

export default (state = Map(), action) => {
  switch (action.type) {
    case actionTypes.MODAL_OPEN_WHAT_TO_TAG:
      return state
        // Save the percentual mouse position, where we want to place a new marker.
        .set('newMarkerPoint', action.point)
        .set('newMarkerRegion', action.region);
    case actionTypes.CREATE_PRODUCT_MARKER_SUCCESS:
    case actionTypes.CREATE_PRODUCT_MARKER_CANCEL:
    case actionTypes.UPDATE_PRODUCT_MARKER_SUCCESS:
    case actionTypes.UPDATE_PRODUCT_MARKER_CANCEL:
    case actionTypes.CREATE_CHARACTER_MARKER_SUCCESS:
    case actionTypes.CREATE_CHARACTER_MARKER_CANCEL:
      return state
        .delete('newMarkerPoint')
        .delete('newMarkerRegion');
    default:
      return state;
  }
};
