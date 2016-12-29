import { destroy } from 'redux-form/immutable';
import { deleteVideoProduct, fetchProduct, fetchGlobalProducts, persistVideoProduct } from './product';
import { getProducts } from '../api/product';
import { currentVideoIdSelector } from '../selectors/common';
import {
  SEARCH_GLOBAL_PRODUCTS_START, SEARCH_GLOBAL_PRODUCTS_SUCCESS, SEARCH_GLOBAL_PRODUCTS_ERROR,
  SIDEBAR_CURRENT_SET_TAB_NAME
} from '../constants/actionTypes';
import { makeApiActionCreator } from '../actions/_utils';

/**
 * Sets the current sidebar tab.
 * @param {string} tabName The name of the tab to set active ('frame', 'global', 'history').
 * @return {Object} The action
 */
export function setCurrentTabName (currentTabName) {
  return { currentTabName, type: SIDEBAR_CURRENT_SET_TAB_NAME };
}

/**
 * Loads all products in the global tab in the sidebar.
 * It fetches the product appearances and then the product and brand.
 */
export function loadGlobalProducts () {
  return async (dispatch, getState) => {
    const state = getState();
    const videoId = currentVideoIdSelector(state);

    // Fetch the global product appearances in a video.
    const globalAppearances = await dispatch(fetchGlobalProducts({ videoId }));
    return Promise.all(globalAppearances.map(({ id }) => dispatch(fetchProduct({ productId: id }))));
  };
}

/**
 * @param {object} params
 * @param {object} params.searchString
 */
export const searchGlobalProducts = makeApiActionCreator(getProducts, SEARCH_GLOBAL_PRODUCTS_START, SEARCH_GLOBAL_PRODUCTS_SUCCESS, SEARCH_GLOBAL_PRODUCTS_ERROR);

// UI actions

export function createGlobalProduct ({ productId, relevance }) {
  return async (dispatch, getState) => {
    const state = getState();
    const videoId = currentVideoIdSelector(state);

    // Persist the global product.
    await dispatch(persistVideoProduct({ productId, relevance, videoId }));
    // Reset the form.
    dispatch(destroy('createGlobalProduct'));
    // Fetch the product with his brand.
    dispatch(fetchProduct({ productId }));
  };
}

export function updateGlobalProduct ({ appearanceId, productId, relevance }) {
  return async (dispatch, getState) => {
    const state = getState();
    const videoId = currentVideoIdSelector(state);

    // Persist the global product, update the state with the new global products
    // returned by the API.
    await dispatch(persistVideoProduct({ appearanceId, productId, relevance, videoId }));
  };
}

export function deleteGlobalProduct (appearanceId) {
  return (dispatch, getState) => {
    const state = getState();
    const videoId = currentVideoIdSelector(state);
    // Remove the global product, update the state with the new global products
    // returned by the API.
    dispatch(deleteVideoProduct({ appearanceId, videoId }));
  };
}
