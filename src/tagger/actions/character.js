/* eslint-disable prefer-const */
/* eslint no-throw-literal: 0 */
import { List } from 'immutable';
import { destroy } from 'redux-form/immutable';
import {
  CHARACTER_OF_SCENE_DELETE_START, CHARACTER_OF_SCENE_DELETE_SUCCESS, CHARACTER_OF_SCENE_DELETE_ERROR,
  CREATE_CHARACTER_MARKER_START, CREATE_CHARACTER_MARKER_SUCCESS, CREATE_CHARACTER_MARKER_ERROR, CREATE_CHARACTER_MARKER_CANCEL,
  CHARACTERS_OF_SCENE_FETCH_START, CHARACTERS_OF_SCENE_FETCH_SUCCESS, CHARACTERS_OF_SCENE_FETCH_ERROR,
  CHARACTER_FETCH_START, CHARACTER_FETCH_SUCCESS, CHARACTER_FETCH_ERROR,
  SEARCH_CHARACTERS_START, SEARCH_CHARACTERS_SUCCESS, SEARCH_CHARACTERS_ERROR,
  MODAL_OPEN_ADD_APPEARANCE_TO_SIMILAR_FRAMES,
  CHARACTER_PRODUCT_GROUPS_FETCH_START, CHARACTER_PRODUCT_GROUPS_FETCH_SUCCESS, CHARACTER_PRODUCT_GROUPS_FETCH_ERROR,
  CHARACTER_PRODUCT_GROUP_FETCH_START, CHARACTER_PRODUCT_GROUP_FETCH_SUCCESS, CHARACTER_PRODUCT_GROUP_FETCH_ERROR,
  CHARACTER_PRODUCT_GROUP_PERSIST_START, CHARACTER_PRODUCT_GROUP_PERSIST_SUCCESS, CHARACTER_PRODUCT_GROUP_PERSIST_ERROR,
  CHARACTER_PRODUCT_GROUP_DELETE_START, CHARACTER_PRODUCT_GROUP_DELETE_SUCCESS, CHARACTER_PRODUCT_GROUP_DELETE_ERROR,
  EDIT_CHARACTER_PRODUCT_GROUP_SELECT, CHARACTER_OPEN
} from '../constants/actionTypes';
import * as characterApi from '../api/character';
import {
  createRecordStart, createRecordSuccess, createRecordError,
  makeFetchRecordsActionCreator, makeApiActionCreator
} from '../actions/_utils';
import { fetchProduct } from './product';
import {
  appearanceEntitiesSelector, currentSceneIdSelector, currentVideoIdSelector,
  sceneHasCharactersRelationsSelector, newMarkerPointSelector, newMarkerRegionSelector, sceneEntitiesSelector, productGroupEntitiesSelector
} from '../selectors/common';
import { openCharacterIdSelector } from '../selectors/quickiesBar/charactersTab';
import { apiBaseUrlSelector, authenticationTokenSelector, currentLocaleSelector } from '../../selectors/global';
import { CHARACTER } from '../constants/appearanceTypes';
import { REVIEW } from '../constants/markerStatusTypes';

export const CHARACTER_APPEARANCES_FETCH_START = 'CHARACTER/CHARACTER_APPEARANCES_FETCH_START';
export const CHARACTER_APPEARANCES_FETCH_SUCCESS = 'CHARACTER/CHARACTER_APPEARANCES_FETCH_SUCCESS';
export const CHARACTER_APPEARANCES_FETCH_ERROR = 'CHARACTER/CHARACTER_APPEARANCES_FETCH_ERROR';

export const VIDEO_CHARACTERS_FETCH_START = 'CHARACTER/VIDEO_CHARACTERS_FETCH_START';
export const VIDEO_CHARACTERS_FETCH_SUCCESS = 'CHARACTER/VIDEO_CHARACTERS_FETCH_SUCCESS';
export const VIDEO_CHARACTERS_FETCH_ERROR = 'CHARACTER/VIDEO_CHARACTERS_FETCH_ERROR';

export const CHARACTER_APPEARANCE_PERSIST_START = 'CHARACTER/CHARACTER_APPEARANCE_PERSIST_START';
export const CHARACTER_APPEARANCE_PERSIST_SUCCESS = 'CHARACTER/CHARACTER_APPEARANCE_PERSIST_SUCCESS';
export const CHARACTER_APPEARANCE_PERSIST_ERROR = 'CHARACTER/CHARACTER_APPEARANCE_PERSIST_ERROR';

export const fetchCharacterAppearances = makeApiActionCreator(characterApi.getCharacterAppearances, CHARACTER_APPEARANCES_FETCH_START, CHARACTER_APPEARANCES_FETCH_SUCCESS, CHARACTER_APPEARANCES_FETCH_ERROR);

function _getCharactersOfScene (state) {
  const sceneId = currentSceneIdSelector(state);
  return sceneHasCharactersRelationsSelector(state).get(sceneId) || List();
}

export const fetchCharactersOfScene = makeFetchRecordsActionCreator(characterApi.getSceneCharacters, (state) => ({
  sceneId: currentSceneIdSelector(state),
  videoId: currentVideoIdSelector(state)
}), CHARACTERS_OF_SCENE_FETCH_START, CHARACTERS_OF_SCENE_FETCH_SUCCESS, CHARACTERS_OF_SCENE_FETCH_ERROR);

export const fetchCharacter = makeApiActionCreator(characterApi.getCharacter, CHARACTER_FETCH_START, CHARACTER_FETCH_SUCCESS, CHARACTER_FETCH_ERROR);
export const fetchVideoCharacters = makeApiActionCreator(characterApi.getVideoCharacters, VIDEO_CHARACTERS_FETCH_START, VIDEO_CHARACTERS_FETCH_SUCCESS, VIDEO_CHARACTERS_FETCH_ERROR);

/**
 * Fetch all characters on the current scene. We only get details of the relation
 * between the scene and the characters, which is the character id and appearanceId.
 */
export function fetchCharacters () {
  return (dispatch, getState) => {
    const state = getState();
    // Retrieve the authentication token from th state.
    const characterAppearances = _getCharactersOfScene(state);
    const appearances = appearanceEntitiesSelector(state);

    // Create a list of promises, which retrieve a character.
    characterAppearances.forEach((characterAppearanceId) => {
      dispatch(fetchCharacter({ characterId: appearances.get(characterAppearanceId).get('id') }));
    });
  };
}

export function createCharacterMarker ({ characterId, markerStatus = REVIEW, point, region, sceneId }) {
  // Error handling by redux-form
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const apiBaseUrl = apiBaseUrlSelector(state);
    const locale = currentLocaleSelector(state);
    const videoId = currentVideoIdSelector(state);

    dispatch(createRecordStart(CREATE_CHARACTER_MARKER_START));
    try {
      // Returns the new characters on the scene.
      const records = await characterApi.postSceneCharacter(apiBaseUrl, authenticationToken, locale, { characterId, markerStatus, point, region, sceneId, videoId });
      dispatch(createRecordSuccess(CREATE_CHARACTER_MARKER_SUCCESS, records, { characterId, sceneId }));
      // Fetch all characters that are on the scene (get image, etc.).
      dispatch(fetchCharacters());
      // Reset the form.
      dispatch(destroy('createCharacterMarker'));
    } catch (error) {
      // Throw the validation error, which will be catched by redux-form.
      if (error.name === 'BadRequestError' && error.code === 'characterId.required') {
        throw { characterId: 'required' };
      }
      // error.code = 'characterAlreadyInScene'
      dispatch(createRecordError(CREATE_CHARACTER_MARKER_ERROR, error));
    }
  };
}

export const persistCharacterAppearance = makeApiActionCreator(characterApi.postSceneCharacter, CHARACTER_APPEARANCE_PERSIST_START, CHARACTER_APPEARANCE_PERSIST_SUCCESS, CHARACTER_APPEARANCE_PERSIST_ERROR);

export function createCharacterMarkerQuickies ({ characterId, point }) {
  // When a character marker is created via the quickiesbar, the marker has no region.
  return (dispatch, getState) => {
    const state = getState();
    const sceneId = currentSceneIdSelector(state);
    dispatch(createCharacterMarker({ characterId, facialRecognition: false, point, sceneId }));
  };
}

export function createCharacterMarkerModal ({ characterId, facialRecognition }) {
  return async (dispatch, getState) => {
    const state = getState();
    // Extract the marker position and the region selected from the state.
    const point = newMarkerPointSelector(state);
    const region = newMarkerRegionSelector(state);
    const scenes = sceneEntitiesSelector(state);
    const sceneId = currentSceneIdSelector(state);

    await dispatch(createCharacterMarker({ characterId, facialRecognition, point, region, sceneId }));

    const scene = scenes.get(sceneId);
    const appearance = { characterId, point };

    // Filter the similar scenes which are hidden.
    const similarSceneIds = (scene && scene.get('similarScenes').filterNot((id) => scenes.getIn([ id, 'hidden' ]))) || List();

    // If the scene has similar scenes, show modal to add the character marker to these scenes.
    if (similarSceneIds.size > 0) {
      dispatch({ appearance, appearanceType: CHARACTER, sceneId: scene.get('id'), similarSceneIds, type: MODAL_OPEN_ADD_APPEARANCE_TO_SIMILAR_FRAMES });
    }
  };
}

/**
  * Remove a character from a scene, return the new list of characters on that scene.
  * @param {Object} params
  * @param {string} params.characterAppearanceId The appearance id of the character in the scene.
  * @param {string} params.sceneId The id of the scene in the video, where the character is part of.
  * @param {string} params.videoId
  */
const _deleteCharacterOfScene = makeApiActionCreator(characterApi.deleteSceneCharacter, CHARACTER_OF_SCENE_DELETE_START, CHARACTER_OF_SCENE_DELETE_SUCCESS, CHARACTER_OF_SCENE_DELETE_ERROR);

export function deleteCharacterOfScene (characterAppearanceId) {
  return async (dispatch, getState) => {
    const state = getState();
    const sceneId = currentSceneIdSelector(state);
    const videoId = currentVideoIdSelector(state);

    dispatch(_deleteCharacterOfScene({ characterAppearanceId, sceneId, videoId }));
  };
}

export function createCharacterMarkerCancel () {
  return (dispatch) => {
    dispatch({ type: CREATE_CHARACTER_MARKER_CANCEL });
    dispatch(destroy('createCharacterMarker'));
  };
}

export const searchCharacters = makeApiActionCreator(characterApi.getCharacters, SEARCH_CHARACTERS_START, SEARCH_CHARACTERS_SUCCESS, SEARCH_CHARACTERS_ERROR);

export const dataFetchProductGroup = makeApiActionCreator(characterApi.getProductGroup, CHARACTER_PRODUCT_GROUP_FETCH_START, CHARACTER_PRODUCT_GROUP_FETCH_SUCCESS, CHARACTER_PRODUCT_GROUP_FETCH_ERROR);

export const fetchProductGroups = makeApiActionCreator(characterApi.getProductGroups, CHARACTER_PRODUCT_GROUPS_FETCH_START, CHARACTER_PRODUCT_GROUPS_FETCH_SUCCESS, CHARACTER_PRODUCT_GROUPS_FETCH_ERROR);

/**
 * Load the product group of a character, with the related products.
 * @param {string} productGroupId
 */
export function loadProductGroup (productGroupId) {
  return async (dispatch, getState) => {
    const state = getState();
    const characterId = openCharacterIdSelector(state);

    // Fetch fresh product group.
    const { products } = await dispatch(dataFetchProductGroup({ characterId, productGroupId }));

    // Fetch the products related to the current character.
    for (const { productId } of products) {
      dispatch(fetchProduct({ productId }));
    }
  };
}

export function selectProductGroupToEdit (productGroupId) {
  return { productGroupId, type: EDIT_CHARACTER_PRODUCT_GROUP_SELECT };
}

export const dataPersistProductGroup = makeApiActionCreator(characterApi.postProductGroup, CHARACTER_PRODUCT_GROUP_PERSIST_START, CHARACTER_PRODUCT_GROUP_PERSIST_SUCCESS, CHARACTER_PRODUCT_GROUP_PERSIST_ERROR);

/**
  * Create/update a product group for the current root medium (commercial/movie/series).
  * @param {Object} data The product group object.
  * @param {string} [data.id] The product group to update. Omit the id to create a product group.
  * @param {string} data.name The name of the product group.
  * @param {[Object]} [data.products=[]] product = { characterId, productId, relevance }
  */
export function persistProductGroup ({ id, name, products = [] }) {
  // Error handling by redux-form
  return async (dispatch, getState) => {
    const state = getState();
    const characterId = openCharacterIdSelector(state);
    // Returns the new products on the scene.
    // Note that we already have all characters and products fetched in the sidebar.
    await dispatch(dataPersistProductGroup({ id, name, characterId, products }));

    // The order of the product groups can be changed, on creation or update of the name.
    dispatch(fetchProductGroups({ characterId }));

    if (id) { // Update a product group.
      // Reset the edit form.
      dispatch(destroy('editCharacterProductGroup'));
      // Deselect the product group which is edited.
      dispatch(selectProductGroupToEdit());
    } else { // Create a product group.
      // Reset the creation form.
      dispatch(destroy('createCharacterProductGroup'));
    }
  };
}

export function createProductGroupProduct (productGroupId, { appearanceId }) {
  return (dispatch, getState) => {
    const state = getState();
    const characterId = openCharacterIdSelector(state);
    const { id, name, products } = productGroupEntitiesSelector(state).get(productGroupId).toJS();
    const appearances = appearanceEntitiesSelector(state);
    const { id: productId, relevance } = appearances.get(appearanceId).toJS();

    products.push({ characterId, productId, relevance });
    dispatch(dataPersistProductGroup({ characterId, id, name, products }));
  };
}

export const _deleteProductGroup = makeApiActionCreator(characterApi.deleteProductGroup, CHARACTER_PRODUCT_GROUP_DELETE_START, CHARACTER_PRODUCT_GROUP_DELETE_SUCCESS, CHARACTER_PRODUCT_GROUP_DELETE_ERROR);

/**
  * Delete a product group from the current root medium.
  * In case of an episode the product group is removed from the series medium,
  * instead of the episode medium because we want to share the product groups
  * across different episodes of the same series.
  * In case of a commercial and movie the product group is removed from the same
  * medium (rootMediumId === mediumId).
  */
export function deleteProductGroup (productGroupId) {
  return async (dispatch, getState) => {
    const state = getState();
    const characterId = openCharacterIdSelector(state);

    await dispatch(_deleteProductGroup({ characterId, productGroupId }));
    dispatch(fetchProductGroups({ characterId }));
  };
}

/**
  * Delete a product quicky from a character product group.
  * @param {string} productGroupId The id of the product group to delete a quicky from.
  * @param {number} index The index of the product quicky in the quickies list.
  */
export function deleteProductQuicky (productGroupId, index) {
  return (dispatch, getState) => {
    const state = getState();
    // Remove from product group.
    const characterId = openCharacterIdSelector(state);
    const productGroup = productGroupEntitiesSelector(state).get(productGroupId);
    const { id, name, products } = productGroup.deleteIn([ 'products', index ]).toJS();
    dispatch(dataPersistProductGroup({ id, characterId, name, products }));
  };
}

/**
 * 'Navigate' to the product groups of the selected character.
 */
export function openCharacter (characterId) {
  return (dispatch) => {
    dispatch({ characterId, type: CHARACTER_OPEN });
    // When going back to the list of characters, there is no characterId.
    if (characterId) {
      dispatch(fetchProductGroups({ characterId }));
    }
  };
}
