import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  currentSceneIdSelector,
  hoveredAppearanceSelector,
  productEntitiesSelector,
  sceneEntitiesSelector,
  sceneHasCharactersRelationsSelector,
  sceneHasProductsRelationsSelector,
  scenesSelector,
  selectedAppearanceSelector
 } from './common';
import { CHARACTER, PRODUCT } from '../constants/appearanceTypes';

const hoveredAppearanceTupleSelector = createSelector(
  currentSceneIdSelector,
  sceneHasCharactersRelationsSelector,
  sceneHasProductsRelationsSelector,
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  productEntitiesSelector,
  hoveredAppearanceSelector,
  (sceneId, sceneHasCharacters, sceneHasProducts, appearances, characters, products, hoveredAppearanceId) => {
    if (sceneId && hoveredAppearanceId) {
      // Create a list of all appearances on the scene and find the hovered appearance.
      const sceneHasAppearanceIds = (sceneHasCharacters.get(sceneId) || List()).concat(sceneHasProducts.get(sceneId) || List());
      const sceneContainsHoveredAppearance = sceneHasAppearanceIds.find((id) => id === hoveredAppearanceId);

      // The hovered appearance was not found in the current scene.
      if (!sceneContainsHoveredAppearance) {
        return null;
      }

      const hoveredAppearance = appearances.get(hoveredAppearanceId);
      const hoveredItemId = hoveredAppearance.get('id');

      // Depending on the appearance type, another entity (character/product) is picked.
      // The entity is used to show more information in a tooltip (e.g., an image).
      switch (hoveredAppearance.get('type')) {
        case CHARACTER:
          return Map({
            appearance: hoveredAppearance,
            entity: characters.get(hoveredItemId)
          });
        case PRODUCT:
          return Map({
            appearance: hoveredAppearance,
            entity: products.get(hoveredItemId)
          });
        default:
          console.warn('Selectors:sceneEditor: Unsupported appearance type ', hoveredAppearance);
          return null;
      }
    }
    return null;
  }
);

const currentSceneSelector = createSelector(
  currentSceneIdSelector,
  sceneEntitiesSelector,
  (sceneId, scenes) => (sceneId && scenes ? scenes.get(sceneId) : null)
);

const appearancesSelector = createSelector(
  currentSceneIdSelector,
  sceneHasCharactersRelationsSelector,
  sceneHasProductsRelationsSelector,
  appearanceEntitiesSelector,
  (sceneId, sceneHasCharacters, sceneHasProducts, appearancesEntities) => {
    const characterAppearanceIds = sceneHasCharacters.get(sceneId) || List();
    const productAppearanceIds = sceneHasProducts.get(sceneId) || List();

    let appearances = List();
    characterAppearanceIds.forEach((characterAppearanceId) => {
      appearances = appearances.push(appearancesEntities.get(characterAppearanceId));
    });
    productAppearanceIds.forEach((productAppearanceId) => {
      appearances = appearances.push(appearancesEntities.get(productAppearanceId));
    });

    return appearances;
  }
);

export default (state) => ({
  appearances: appearancesSelector(state),
  currentScene: currentSceneSelector(state),
  hoveredAppearanceTuple: hoveredAppearanceTupleSelector(state),
  selectedAppearance: selectedAppearanceSelector(state),
  scenes: scenesSelector(state)
});
