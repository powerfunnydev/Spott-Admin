import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  currentModalSelector,
  currentSceneIdSelector,
  newMarkerRegionSelector,
  productEntitiesSelector,
  productSuggestionsRelationsSelector,
  sceneHasCharactersRelationsSelector
} from './common';
import { tooltipSelector } from './global';

/**
 * Extracts the characters of the current scene from the state tree.
 * When the characters are not yet fetched,  a empty list is returned.
 */
const charactersSelector = createSelector(
  currentSceneIdSelector,
  sceneHasCharactersRelationsSelector,
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  (sceneId, sceneHasCharacters, appearances, characters) => {
    // sceneHasCharacters and characters are always present, but can be empty Immutable Map's.
    const characterAppearances = sceneHasCharacters.get(sceneId) || List();
    return characterAppearances
      .map((characterAppearanceId) => characters.get(appearances.get(characterAppearanceId).get('id')))
      .filter((character) => character && (!character.get('_status') || character.get('_status') === 'updating'));
  }
);

const productSuggestionsSelector = createSelector(
  productSuggestionsRelationsSelector,
  productEntitiesSelector,
  (productSuggestions, products) => {
    // If there are no suggestion, simply return null
    if (!productSuggestions) {
      return null;
    }
    // Return list if there are product suggestion
    return productSuggestions.map((suggestion) => {
      return new Map({
        accuracy: suggestion.get('accuracy'),
        product: products.get(suggestion.get('productId'))
      });
    });
  }
);

export default createStructuredSelector({
  currentModal: currentModalSelector,
  characters: charactersSelector,
  productSuggestions: productSuggestionsSelector,
  region: newMarkerRegionSelector,
  tooltip: tooltipSelector
});
