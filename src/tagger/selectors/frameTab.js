import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  appearanceEntitiesSelector,
  brandEntitiesSelector,
  characterEntitiesSelector,
  currentSceneIdSelector,
  currentTabNameSelector,
  hoveredAppearanceSelector,
  productEntitiesSelector,
  sceneHasCharactersRelationsSelector,
  sceneHasProductsRelationsSelector,
  selectedAppearanceSelector
} from './common';

/**
 * Extracts the characters of the current scene from the state tree.
 * The characters can be undefined, in case the characters are not yet fetched.
 * A character can equal:
 * - Character is currently busy fetching:
 *   { _status: 'fetching' }
 * - Fetching the character failed:
 *   { _error: <the error>, _status: 'error' }
 * - Character is already fetched, we're currently refetching the character to update the data:
 *   { name: 'character name', ..., _status: 'updating' }
 */
const charactersSelector = createSelector(
  currentSceneIdSelector,
  sceneHasCharactersRelationsSelector,
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  (sceneId, sceneHasCharacters, appearances, characters) => {
    // sceneHasCharacters, appearances and characters are always present, but can be empty Immutable Map's.
    // A list of appearance id's of characters.
    const characterAppearances = sceneHasCharacters.get(sceneId) || List();
    return characterAppearances.map((characterAppearanceId) => {
      // A scene character has an appearanceId and id (which is the character id).
      const sceneCharacter = appearances.get(characterAppearanceId);
      const character = characters.get(sceneCharacter.get('id'));
      return Map({ sceneCharacter, character });
    });
  }
);

/**
 * Extracts the products of the current scene from the state tree.
 * Similar to the charactersSelector.
 */
const productsSelector = createSelector(
  currentSceneIdSelector,
  sceneHasProductsRelationsSelector,
  appearanceEntitiesSelector,
  brandEntitiesSelector,
  productEntitiesSelector,
  (sceneId, sceneHasProducts, appearances, brands, products) => {
    // sceneHasProducts and products are always present, but can be empty Immutable Map's.
    const productAppearances = sceneHasProducts.get(sceneId);
    if (productAppearances) {
      return productAppearances.map((productAppearanceId) => {
        // A scene product has an appearanceId, id (which is the product id), point, relavance, etc.
        const sceneProduct = appearances.get(productAppearanceId);
        const product = products.get(sceneProduct.get('id'));
        const brand = product && brands.get(product.get('brandId'));
        return Map({ brand, sceneProduct, product });
      });
    }
    return List();
  }
);

export default (state) => ({
  characterTuples: charactersSelector(state),
  currentTabName: currentTabNameSelector(state),
  hoveredAppearance: hoveredAppearanceSelector(state),
  productTuples: productsSelector(state),
  selectedAppearance: selectedAppearanceSelector(state)
});
