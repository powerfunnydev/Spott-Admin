/* eslint no-throw-literal: 0 */
import {
  APPEARANCE_COPY, APPEARANCE_HOVER, APPEARANCE_LEAVE, APPEARANCE_SELECT, APPEARANCE_TOGGLE_SELECT,
  UPDATE_CHARACTER_MARKER_START, UPDATE_CHARACTER_MARKER_SUCCESS, UPDATE_CHARACTER_MARKER_ERROR,
  UPDATE_PRODUCT_MARKER_START, UPDATE_PRODUCT_MARKER_SUCCESS, UPDATE_PRODUCT_MARKER_ERROR,
  MODAL_CLOSE
} from '../constants/actionTypes';
import { createRecordStart, createRecordSuccess, createRecordError } from '../actions/_utils';
import { appearanceEntitiesSelector, copyAppearanceIdSelector, currentSceneIdSelector, currentVideoIdSelector, selectedAppearanceSelector, similarScenesAppearanceSelector, similarScenesAppearanceTypeSelector } from '../selectors/common';
import { apiBaseUrlSelector, authenticationTokenSelector, currentLocaleSelector } from '../../selectors/global';
import { CHARACTER, PRODUCT } from '../constants/appearanceTypes';
import { postSceneCharacter } from '../api/character';
import { postSceneProduct } from '../api/product';
import { isSimilarScenesSelector } from '../selectors/addAppearanceToSimilarFrames';
import { createCharacterMarker } from './character';
import { createProductMarker } from './product';

/**
 * Hover the specified product/character appearance on a scene
 * @return {Object} The action
 */
export function hover (appearanceId) {
  return { type: APPEARANCE_HOVER, appearanceId };
}

/**
 * Leave the currently hovered product/character appearance.
 * @return {Object} The action
 */
export function leave () {
  return { type: APPEARANCE_LEAVE };
}

/**
 * Select/deselect the specified product/character appearance on a scene
 * @return {Object} The action
 */
export function toggleSelect (appearanceId) {
  return { appearanceId, type: APPEARANCE_TOGGLE_SELECT };
}

export function select (appearanceId) {
  return { appearanceId, type: APPEARANCE_SELECT };
}

export function move (appearanceId, point) {
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const apiBaseUrl = apiBaseUrlSelector(state);
    const locale = currentLocaleSelector(state);

    const sceneId = currentSceneIdSelector(state);
    const videoId = currentVideoIdSelector(state);
    const appearance = appearanceEntitiesSelector(state).get(appearanceId).toJS();

    switch (appearance.type) {
      case CHARACTER: {
        const { id: characterId, markerHidden, markerStatus, region } = appearance;
        dispatch(createRecordStart(UPDATE_CHARACTER_MARKER_START));
        try {
          // Returns the new products on the scene.
          const records = await postSceneCharacter(apiBaseUrl, authenticationToken, locale, { appearanceId, characterId, markerHidden, markerStatus, point, region, sceneId, videoId });
          dispatch(createRecordSuccess(UPDATE_CHARACTER_MARKER_SUCCESS, records, { sceneId }));
        } catch (error) {
          dispatch(createRecordError(UPDATE_CHARACTER_MARKER_ERROR, error));
        }
        break;
      }
      case PRODUCT: {
        const { characterId, markerHidden, markerStatus, id: productId, region, relevance } = appearance;
        dispatch(createRecordStart(UPDATE_PRODUCT_MARKER_START));
        try {
          // Returns the new products on the scene.
          const records = await postSceneProduct(apiBaseUrl, authenticationToken, locale, { appearanceId, characterId, markerHidden, markerStatus, point, productId, region, relevance, sceneId, videoId });
          dispatch(createRecordSuccess(UPDATE_PRODUCT_MARKER_SUCCESS, records, { sceneId }));
        } catch (error) {
          dispatch(createRecordError(UPDATE_PRODUCT_MARKER_ERROR, error));
        }
        break;
      }
    }
  };
}

export function copy () {
  return (dispatch, getState) => {
    const state = getState();
    const appearanceId = selectedAppearanceSelector(state);
    if (typeof appearanceId === 'string') {
      dispatch({ appearanceId, type: APPEARANCE_COPY });
    }
  };
}

/**
 * Copy appearances (characters/products) to a scene.
 * @param {string} [pasteSceneId] The scene where the appearances should be copied to.
 *                                When no scene id is provided, the current selected scene will be used.
 */
export function paste (pasteSceneId) {
  return async (dispatch, getState) => {
    const state = getState();
    const sceneId = pasteSceneId || currentSceneIdSelector(state);
    const appearanceId = copyAppearanceIdSelector(state);

    if (appearanceId) {
      const appearance = appearanceEntitiesSelector(state).get(appearanceId).toJS();

      switch (appearance.type) {
        case CHARACTER: {
          const { id: characterId, point } = appearance; // TODO: also paste region.
          dispatch(createCharacterMarker({ characterId, facialRecognition: false, point, sceneId }));
          break;
        }
        case PRODUCT: {
          const { characterId, id: productId, markerHidden, point, relevance } = appearance;
          dispatch(createProductMarker({ characterId, markerHidden, point, productId, relevance, sceneId }));
          break;
        }
      }
    }
  };
}

export function addAppearanceToSimilarFramesCancel () {
  return { type: MODAL_CLOSE };
}

export function addAppearanceToSimilarFrames () {
  return (dispatch, getState) => {
    const state = getState();
    const isSimilarScenes = isSimilarScenesSelector(state);
    const appearance = similarScenesAppearanceSelector(state);
    const appearanceType = similarScenesAppearanceTypeSelector(state);

    const similarScenesIds = isSimilarScenes.reduce((sceneIds, isSelected, sceneId) => {
      if (isSelected) {
        sceneIds.push(sceneId);
      }
      return sceneIds;
    }, []);

    // Just close the modal, there are no similar frames.
    if (similarScenesIds.length === 0) {
      return dispatch({ type: MODAL_CLOSE });
    }

    switch (appearanceType) {
      case CHARACTER:
        similarScenesIds.forEach((sceneId) => {
          dispatch(createCharacterMarker({ ...appearance, facialRecognition: false, region: null, sceneId }));
        });
        break;
      case PRODUCT:
        similarScenesIds.forEach((sceneId) => {
          dispatch(createProductMarker({ ...appearance, sceneId }));
        });
        break;
    }
  };
}
