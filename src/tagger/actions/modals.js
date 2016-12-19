import {
  MODAL_OPEN_WHAT_TO_TAG,
  MODAL_OPEN_CREATE_CHARACTER_MARKER,
  /* MODAL_OPEN_UPDATE_CHARACTER_MARKER, */
  MODAL_OPEN_CREATE_PRODUCT_MARKER,
  MODAL_OPEN_UPDATE_PRODUCT_MARKER,
  MODAL_CLOSE
} from '../constants/actionTypes';
import { /* CHARACTER, */ PRODUCT } from '../constants/appearanceTypes';
import {
  appearanceEntitiesSelector,
  currentSceneImageIdSelector,
  newMarkerRegionSelector
} from '../selectors/common';
import {
  suggestProducts
} from './product';

/**
 * Opens the modal dialog 'what to tag?'. Product or character?
 * @param {Object} region The percentual position of the marker.
 * @param {number} region.x Percentage x-axis.
 * @param {number} region.y Percentage y-axis.
 * @param {Object} region The percentual position of the region.
 * @param {number} region.width Percentage width.
 * @param {number} region.height Percentage height.
 * @param {number} region.x Percentage x-axis.
 * @param {number} region.y Percentage y-axis.
 * @return {Object} The action
 */
export function openWhatToTag (point, region) {
  return { point, region, type: MODAL_OPEN_WHAT_TO_TAG };
}

/**
 * Opens the modal dialog 'add character marker'.
 * @return {Object} The action
 */
export function openCreateCharacterMarker () {
  return { type: MODAL_OPEN_CREATE_CHARACTER_MARKER };
}

/**
 * Opens the modal dialog 'add product marker'.
 * @return {Object} The action
 */
export function openCreateProductMarker () {
  return { type: MODAL_OPEN_CREATE_PRODUCT_MARKER };
}

export function openUpdateAppearance (appearanceId) {
  return (dispatch, getState) => {
    const state = getState();
    const appearance = appearanceEntitiesSelector(state).get(appearanceId);

    // Open the modal that contains the update form.
    switch (appearance.get('type')) {
      // TODO: Updating character is not yet implemented.
      // case CHARACTER:
      //   dispatch({ appearanceId, type: MODAL_OPEN_UPDATE_CHARACTER_MARKER });
      //   break;
      case PRODUCT:
        dispatch({ appearanceId, type: MODAL_OPEN_UPDATE_PRODUCT_MARKER });
        break;
      default:
        console.warn('actions:openUpdateAppearance: Unsupported appearance type: ', appearance.toJS());
    }
  };
}

/**
 * Opens the modal dialog 'product suggestions'.
 * This dialog shows suggestions for the currently selected region in the
 * currently selected scene.
 * @return {Object} The action
 */
export function seeProductSuggestions () {
  return async (dispatch, getState) => {
    const state = getState();
    const sceneImageId = currentSceneImageIdSelector(state);
    const region = newMarkerRegionSelector(state);
    try {
      // Fetch product suggestions
      await dispatch(suggestProducts({ imageId: sceneImageId, region }));
    } catch (e) {
      // Just eat the error to prevent "unhandled promise rejection"
    }
  };
}

/**
 * Close the opened modal dialog, if any.
 * @return {Object} The action
 */
export function close () {
  return { type: MODAL_CLOSE };
}
