import { List } from 'immutable';
import { destroy } from 'redux-form/immutable';
import {
  CREATE_PRODUCT_MARKER_START, CREATE_PRODUCT_MARKER_SUCCESS, CREATE_PRODUCT_MARKER_ERROR, CREATE_PRODUCT_MARKER_CANCEL,
  UPDATE_PRODUCT_MARKER_START, UPDATE_PRODUCT_MARKER_SUCCESS, UPDATE_PRODUCT_MARKER_ERROR, UPDATE_PRODUCT_MARKER_CANCEL,
  PRODUCT_OF_SCENE_DELETE_START, PRODUCT_OF_SCENE_DELETE_SUCCESS, PRODUCT_OF_SCENE_DELETE_ERROR,
  SCENE_PRODUCTS_FETCH_START, SCENE_PRODUCTS_FETCH_SUCCESS, SCENE_PRODUCTS_FETCH_ERROR,
  VIDEO_PRODUCTS_FETCH_START, VIDEO_PRODUCTS_FETCH_SUCCESS, VIDEO_PRODUCTS_FETCH_ERROR,
  PRODUCT_FETCH_START, PRODUCT_FETCH_SUCCESS, PRODUCT_FETCH_ERROR,
  SEARCH_PRODUCTS_START, SEARCH_PRODUCTS_SUCCESS, SEARCH_PRODUCTS_ERROR,
  MODAL_OPEN_ADD_APPEARANCE_TO_SIMILAR_FRAMES,
  SUGGEST_PRODUCTS_START, SUGGEST_PRODUCTS_SUCCESS, SUGGEST_PRODUCTS_ERROR,
  PRODUCT_SUGGESTION_ADD_IMAGE_START, PRODUCT_SUGGESTION_ADD_IMAGE_SUCCESS, PRODUCT_SUGGESTION_ADD_IMAGE_ERROR,
  CLEAR_PRODUCT_SUGGESTIONS,
  VIDEO_PRODUCT_PERSIST_START, VIDEO_PRODUCT_PERSIST_SUCCESS, VIDEO_PRODUCT_PERSIST_ERROR,
  VIDEO_PRODUCT_DELETE_START, VIDEO_PRODUCT_DELETE_SUCCESS, VIDEO_PRODUCT_DELETE_ERROR,
  SIMILAR_PRODUCTS_FETCH_START, SIMILAR_PRODUCTS_FETCH_SUCCESS, SIMILAR_PRODUCTS_FETCH_ERROR
} from '../constants/actionTypes';
import * as productApi from '../api/product';
import { makeFetchRecordsActionCreator, makeApiActionCreator } from '../actions/_utils';
import {
  appearanceEntitiesSelector,
  currentSceneIdSelector,
  currentSceneImageIdSelector,
  currentVideoIdSelector,
  newMarkerPointSelector,
  sceneEntitiesSelector,
  sceneHasProductsRelationsSelector,
  newMarkerRegionSelector
} from '../selectors/common';
import { fetchBrand } from './brand';
import { PRODUCT } from '../constants/appearanceTypes';

function _getProductsOfScene (state) {
  const sceneId = currentSceneIdSelector(state);
  return sceneHasProductsRelationsSelector(state).get(sceneId) || List();
}

export const fetchProductsOfScene = makeFetchRecordsActionCreator(productApi.getSceneProducts, (state) => ({
  sceneId: currentSceneIdSelector(state),
  videoId: currentVideoIdSelector(state)
}), SCENE_PRODUCTS_FETCH_START, SCENE_PRODUCTS_FETCH_SUCCESS, SCENE_PRODUCTS_FETCH_ERROR);

/**
 * Performs a request to add a region within the given image with given imageId
 * for recognition of the product with given productId.
 * @param {object} params
 * @param {object} params.imageId
 * @param {object} params.region
 * @param {object} params.productId
 */
export const addImageForProductSuggestion = makeApiActionCreator(productApi.postProductSuggestionImage, PRODUCT_SUGGESTION_ADD_IMAGE_START, PRODUCT_SUGGESTION_ADD_IMAGE_SUCCESS, PRODUCT_SUGGESTION_ADD_IMAGE_ERROR);

const _fetchProduct = makeApiActionCreator(productApi.getProduct, PRODUCT_FETCH_START, PRODUCT_FETCH_SUCCESS, PRODUCT_FETCH_ERROR);

export function fetchProduct ({ productId }) {
  return async (dispatch) => {
    const { brandId } = await dispatch(_fetchProduct({ productId }));
    await dispatch(fetchBrand({ brandId }));
  };
}

// Fetch all products, in parallel.
export function fetchProducts () {
  return (dispatch, getState) => {
    const state = getState();
    const productsAppearances = _getProductsOfScene(state);
    const appearances = appearanceEntitiesSelector(state);

    // Create a list of promises, which retrieve a product.
    return Promise.all(productsAppearances.map((productAppearanceId) => {
      return dispatch(fetchProduct({ productId: appearances.get(productAppearanceId).get('id') }));
    }));
  };
}

/**
  * @param {Object} params
  * @param {string} params.productId
  */
export const fetchSimilarProducts = makeApiActionCreator(productApi.getSimilarProducts, SIMILAR_PRODUCTS_FETCH_START, SIMILAR_PRODUCTS_FETCH_SUCCESS, SIMILAR_PRODUCTS_FETCH_ERROR);

/**
  * Remove a product from a scene, return the new list of products on that scene.
  * @param {Object} params
  * @param {string} params.productAppearanceId The appearance id of the product in the scene.
  * @param {string} params.sceneId The id of the scene in the video, where the product is part of.
  * @param {string} params.videoId
  */
const _deleteProductOfScene = makeApiActionCreator(productApi.deleteSceneProduct, PRODUCT_OF_SCENE_DELETE_START, PRODUCT_OF_SCENE_DELETE_SUCCESS, PRODUCT_OF_SCENE_DELETE_ERROR);

export function deleteProductOfScene (productAppearanceId) {
  return async (dispatch, getState) => {
    const state = getState();
    const sceneId = currentSceneIdSelector(state);
    const videoId = currentVideoIdSelector(state);

    dispatch(_deleteProductOfScene({ productAppearanceId, sceneId, videoId }));
  };
}

/**
  * Add a product to a scene, return the new list of products on that scene.
  * @param {Object} params
  * @param {string} [params.appearanceId] The id of the appearance that needs to be updated. Leave it empty to add a product appearance.
  * @param {string} [params.characterId] The id of the character that wears the product.
  * @param {string} params.markerStatus The status of the marker, which can be 'ATTENTION', 'DONE' or 'REVIEW'.
  * @param {Object} params.point The percentual position of the product in the scene (integers).
  * @param {number} params.point.x The percentual position of the product on the x-axis.
  * @param {number} params.point.y The percentual position of the product on the y-axis.
  * @param {string} params.product The id of the product in the scene.
  * @param {string} params.relevance The relevance of the product, which can be 'EXACT', 'LOW', 'MEDIUM' or 'NONE'.
  * @param {string} params.sceneId The id of the scene in the video.
  * @param {string} params.videoId
 */
export const _createProductMarker = makeApiActionCreator(productApi.postSceneProduct, CREATE_PRODUCT_MARKER_START, CREATE_PRODUCT_MARKER_SUCCESS, CREATE_PRODUCT_MARKER_ERROR);

export function createProductMarker ({ characterId, markerHidden, point, productId, relevance, sceneId }) {
  // Error handling by redux-form
  return async (dispatch, getState) => {
    const state = getState();
    const videoId = currentVideoIdSelector(state);

    // Returns the new products on the scene.
    await dispatch(_createProductMarker({ characterId, markerHidden, point, productId, relevance, sceneId, videoId }));
    // Fetch all products that are on the scene (get image, etc.).
    dispatch(fetchProducts());
    // Reset the form.
    dispatch(destroy('createProductMarker'));
  };
}

export function createProductMarkerQuickies ({ characterId, markerHidden, point, productId, relevance }) {
  return (dispatch, getState) => {
    const state = getState();
    const sceneId = currentSceneIdSelector(state);
    dispatch(createProductMarker({ characterId, markerHidden, point, productId, relevance, sceneId }));
  };
}

export function createProductMarkerModal ({ characterId, markerHidden, productId, productSuggestion, relevance }) {
  // Error handling by redux-form
  return async (dispatch, getState) => {
    const state = getState();
    const scenes = sceneEntitiesSelector(state);
    const sceneId = currentSceneIdSelector(state);
    const sceneImageId = currentSceneImageIdSelector(state);
    const region = newMarkerRegionSelector(state);
    const point = newMarkerPointSelector(state);
    await dispatch(createProductMarker({ characterId, markerHidden, point, productId, productSuggestion, relevance, sceneId }));
    // Perform add for product suggestion if necessary
    if (productSuggestion) {
      await dispatch(addImageForProductSuggestion({ imageId: sceneImageId, region, productId }));
    }

    const scene = scenes.get(sceneId);
    const appearance = { characterId, markerHidden, point, productId, relevance };

    // Filter the similar scenes which are hidden.
    const similarSceneIds = (scene && scene.get('similarScenes').filterNot((id) => scenes.getIn([ id, 'hidden' ]))) || List();

    // If the scene has similar scenes, show modal to add the product marker to these scenes
    if (similarSceneIds.size > 0) {
      dispatch({ appearance, appearanceType: PRODUCT, sceneId: scene.get('id'), similarSceneIds, type: MODAL_OPEN_ADD_APPEARANCE_TO_SIMILAR_FRAMES });
    }
  };
}

/**
* @param {Object} params
* @param {string} [params.appearanceId] The id of the appearance that needs to be updated. Leave it empty to add a product appearance.
* @param {string} [params.characterId] The id of the character that wears the product.
* @param {string} params.markerStatus The status of the marker, which can be 'ATTENTION', 'DONE' or 'REVIEW'.
* @param {Object} params.point The percentual position of the product in the scene (integers).
* @param {number} params.point.x The percentual position of the product on the x-axis.
* @param {number} params.point.y The percentual position of the product on the y-axis.
* @param {string} params.product The id of the product in the scene.
* @param {string} params.relevance The relevance of the product, which can be 'EXACT', 'LOW', 'MEDIUM' or 'NONE'.
* @param {string} params.sceneId The id of the scene in the video.
* @param {string} params.videoId
 */
export const _updateProductMarker = makeApiActionCreator(productApi.postSceneProduct, UPDATE_PRODUCT_MARKER_START, UPDATE_PRODUCT_MARKER_SUCCESS, UPDATE_PRODUCT_MARKER_ERROR);

export function updateProductMarker ({ appearanceId, characterId, markerHidden, point, productId, relevance }) {
  // Error handling by redux-form
  return async (dispatch, getState) => {
    const state = getState();
    const sceneId = currentSceneIdSelector(state);
    const videoId = currentVideoIdSelector(state);

    await dispatch(_updateProductMarker({ appearanceId, characterId, markerHidden, point, productId, relevance, sceneId, videoId }));
    // Fetch all products that are on the scene (get image, etc.).
    dispatch(fetchProducts());
    // Reset the form.
    dispatch(destroy('updateProductMarker'));
  };
}

export function updateProductMarkerCancel () {
  return async (dispatch) => {
    dispatch({ type: UPDATE_PRODUCT_MARKER_CANCEL });
    dispatch(destroy('updateProductMarker'));
  };
}

export function createProductMarkerCancel () {
  return async (dispatch) => {
    dispatch({ type: CREATE_PRODUCT_MARKER_CANCEL });
    dispatch(destroy('createProductMarker'));
  };
}

/**
 * @param {object} params
 * @param {object} params.searchString
 */
export const searchProducts = makeApiActionCreator(productApi.getProducts, SEARCH_PRODUCTS_START, SEARCH_PRODUCTS_SUCCESS, SEARCH_PRODUCTS_ERROR);

/**
 * Searches for product suggestions given a region in the given image.
 * @param {Object} data
 * @param {string} data.imageId The unique identifier of the image from which a rectangular part is taken.
 * @param {Object} data.region
 * @param {number} data.region.x The (procentual) x-coordinate of the upperleft corner of the rectangle in the image.
 * @param {number} data.region.y The (procentual) y-coordinate of the upperleft corner of the rectangle in the image.
 * @param {number} data.region.width The (procentual) width of the rectangle in the image.
 * @param {number} data.region.height The (procentual) height of the rectangle in the image.
 */
export const suggestProducts = makeApiActionCreator(productApi.getProductSuggestions, SUGGEST_PRODUCTS_START, SUGGEST_PRODUCTS_SUCCESS, SUGGEST_PRODUCTS_ERROR);

export function clearProductSuggestions () {
  return { type: CLEAR_PRODUCT_SUGGESTIONS };
}

// Video product (global products)
// ///////////////////////////////

/**
 * Fetch a list of global video appearances.
 * @param {Object} params
 * @param {string} params.videoId
 */
export const fetchVideoProducts = makeApiActionCreator(productApi.getVideoProducts, VIDEO_PRODUCTS_FETCH_START, VIDEO_PRODUCTS_FETCH_SUCCESS, VIDEO_PRODUCTS_FETCH_ERROR);

/**
 * Remove a global video appearance.
 * @param {Object} params
 * @param {string} params.appearanceId
 * @param {string} params.videoId
 */
export const deleteVideoProduct = makeApiActionCreator(productApi.deleteVideoProduct, VIDEO_PRODUCT_DELETE_START, VIDEO_PRODUCT_DELETE_SUCCESS, VIDEO_PRODUCT_DELETE_ERROR);

/**
 * Create a global video appearance.
 * @param {Object} params
 * @param {string} params.appearanceId
 * @param {string} params.productId
 * @param {string} params.relevance
 * @param {string} params.videoId
 */
export const persistVideoProduct = makeApiActionCreator(productApi.postVideoProduct, VIDEO_PRODUCT_PERSIST_START, VIDEO_PRODUCT_PERSIST_SUCCESS, VIDEO_PRODUCT_PERSIST_ERROR);
