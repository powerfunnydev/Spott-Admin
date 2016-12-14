import { destroy } from 'redux-form/immutable';
import { makeApiActionCreator } from '../actions/_utils';
import {
  PRODUCT_GROUP_FETCH_START, PRODUCT_GROUP_FETCH_SUCCESS, PRODUCT_GROUP_FETCH_ERROR,
  PRODUCT_GROUPS_FETCH_START, PRODUCT_GROUPS_FETCH_SUCCESS, PRODUCT_GROUPS_FETCH_ERROR,
  PRODUCT_GROUP_PERSIST_START, PRODUCT_GROUP_PERSIST_SUCCESS, PRODUCT_GROUP_PERSIST_ERROR,
  PRODUCT_GROUP_DELETE_START, PRODUCT_GROUP_DELETE_SUCCESS, PRODUCT_GROUP_DELETE_ERROR,
  CHARACTER_SELECT, PRODUCT_SELECT, EDIT_PRODUCT_GROUP_SELECT, QUICKIES_SELECT_TAB, LOCAL_QUICKY_DELETE
} from '../constants/actionTypes';
import { fetchCharacter } from './character';
import { fetchProduct } from './product';
import { appearanceEntitiesSelector, currentMediumSelector, productGroupEntitiesSelector } from '../selectors/common';
import { charactersSelector } from '../selectors/quickiesBar/latestTab';
import { currentRootMediumIdSelector } from '../selectors/quickiesBar/scenesTab';
import * as quickiesApi from '../api/quickies';

export const dataFetchProductGroup = makeApiActionCreator(quickiesApi.getProductGroup, PRODUCT_GROUP_FETCH_START, PRODUCT_GROUP_FETCH_SUCCESS, PRODUCT_GROUP_FETCH_ERROR);

export const fetchProductGroups = makeApiActionCreator(quickiesApi.getProductGroups, PRODUCT_GROUPS_FETCH_START, PRODUCT_GROUPS_FETCH_SUCCESS, PRODUCT_GROUPS_FETCH_ERROR);

export function selectCharacter (characterId) {
  return { characterId, type: CHARACTER_SELECT };
}

/**
 * Load the product group, the related characters and products.
 * @param {string} productGroupId
 */
export function loadProductGroup (productGroupId) {
  return async (dispatch, getState) => {
    const state = getState();
    const mediumId = currentRootMediumIdSelector(state);

    // Fetch fresh product group.
    const { products } = await dispatch(dataFetchProductGroup({ mediumId, productGroupId }));

    // Fetch characters and products.
    for (const { characterId, productId } of products) {
      if (characterId) {
        dispatch(fetchCharacter({ characterId }));
      }
      dispatch(fetchProduct({ productId }));
    }
  };
}

export function selectProductGroupToEdit (productGroupId) {
  return { productGroupId, type: EDIT_PRODUCT_GROUP_SELECT };
}

export function selectTab (tab) {
  return { tab, type: QUICKIES_SELECT_TAB };
}

/**
  * Select a character by pressing one of the following digits on your keyboard:
  * '1', '2', ..., '9' or '0'. Pressing '0' will select the tenth character.
  */
export function selectCharacterByShortkey (keyBoardEvent) {
  return (dispatch, getState) => {
    const state = getState();
    const characters = charactersSelector(state);
    const digit = keyBoardEvent.keyCode % 48;

    // When pressing '1', the all group is selected, which contains all recent quickies.
    if (digit === 1) {
      return dispatch(selectCharacter());
    }

    // When pressing '2', '3', ..., '9', '0', the respective character
    // is selected. '0' is the tenth character.
    const index = (digit + 8) % 10;
    const characterId = characters.toArray()[index];
    if (characterId) {
      dispatch(selectCharacter(characterId));
    }
  };
}

export const dataPersistProductGroup = makeApiActionCreator(quickiesApi.postProductGroup, PRODUCT_GROUP_PERSIST_START, PRODUCT_GROUP_PERSIST_SUCCESS, PRODUCT_GROUP_PERSIST_ERROR);

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
    const mediumId = currentRootMediumIdSelector(state);
    // Returns the new products on the scene.
    // Note that we already have all characters and products fetched in the sidebar.
    await dispatch(dataPersistProductGroup({ id, name, mediumId, products }));

    // The order of the product groups can be changed, on creation or update of the name.
    dispatch(fetchProductGroups({ mediumId }));

    if (id) { // Update a product group.
      // Reset the edit form.
      dispatch(destroy('editProductGroup'));
      // Deselect the product group which is edited.
      dispatch(selectProductGroupToEdit());
    } else { // Create a product group.
      // Reset the creation form.
      dispatch(destroy('createProductGroup'));
    }
  };
}

export function createProductGroupProduct (productGroupId, { appearanceId, appearanceType }) {
  return (dispatch, getState) => {
    const state = getState();
    const mediumId = currentRootMediumIdSelector(state);
    const { id, name, products } = productGroupEntitiesSelector(state).get(productGroupId).toJS();
    const appearances = appearanceEntitiesSelector(state);
    const { characterId, id: productId, markerHidden, relevance } = appearances.get(appearanceId).toJS();

    products.push({ characterId, markerHidden, productId, relevance });
    dispatch(dataPersistProductGroup({ id, mediumId, name, products }));
  };
}

export const _deleteProductGroup = makeApiActionCreator(quickiesApi.deleteProductGroup, PRODUCT_GROUP_DELETE_START, PRODUCT_GROUP_DELETE_SUCCESS, PRODUCT_GROUP_DELETE_ERROR);

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
    const mediumId = currentRootMediumIdSelector(state);

    await dispatch(_deleteProductGroup({ mediumId, productGroupId }));
    dispatch(fetchProductGroups({ mediumId }));
  };
}

/**
  * Delete a character quicky from the local quickies bar.
  * @param {number} index The index of the product quicky in the quickies list.
  */
export function deleteCharacterQuicky (index) {
  return { index, type: LOCAL_QUICKY_DELETE };
}

/**
  * Delete a product quicky, either from the local quickies bar or from the
  * product group.
  * @param {string} [productGroupId] The id of the product group to delete a quicky from.
  * @param {number} index The index of the product quicky in the quickies list.
  */
export function deleteProductQuicky (productGroupId, index) {
  return (dispatch, getState) => {
    const state = getState();

    if (productGroupId) {
      // Remove from product group.
      const mediumId = currentRootMediumIdSelector(state);
      const productGroup = productGroupEntitiesSelector(state).get(productGroupId);
      const { id, name, products } = productGroup.deleteIn([ 'products', index ]).toJS();
      dispatch(dataPersistProductGroup({ id, mediumId, name, products }));
    } else {
      // Remove from local/temporary quickies bar.
      dispatch({ index, type: LOCAL_QUICKY_DELETE });
    }
  };
}

export function loadCharacters () {
  return (dispatch, getState) => {
    const state = getState();
    const medium = currentMediumSelector(state);
    const characters = medium.get('characters');
    // Medium should be fetched first.
    if (characters) {
      for (const character of characters) {
        dispatch(fetchCharacter({ characterId: character.get('id') }));
      }
    }
  };
}

export function selectProduct (productId) {
  return { productId, type: PRODUCT_SELECT };
}
