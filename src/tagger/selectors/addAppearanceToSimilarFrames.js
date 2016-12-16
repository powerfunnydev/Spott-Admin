import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { CHARACTER, PRODUCT } from '../constants/appearanceTypes';
import { currentSceneIdSelector, similarScenesOfSceneRelationsSelector, similarScenesAppearanceSelector,
    similarScenesAppearanceTypeSelector, characterEntitiesSelector, productEntitiesSelector, sceneEntitiesSelector } from './common';
import { scenesSelector } from './sceneSelector';

// Returns a Map of <sceneId, isSimilar>.
// Only the scenes which are not hidden.
export const isSimilarScenesSelector = createSelector(
  currentSceneIdSelector,
  similarScenesOfSceneRelationsSelector,
  sceneEntitiesSelector,
  (currentSceneId, similarScenesOfScene, scenes) => (currentSceneId && similarScenesOfScene && similarScenesOfScene.get(currentSceneId)) || Map()
);

export const titleSelector = createSelector(
  similarScenesAppearanceSelector,
  similarScenesAppearanceTypeSelector,
  characterEntitiesSelector,
  productEntitiesSelector,
  (appearance, appearanceType, characters, products) => {
    switch (appearanceType) {
      case CHARACTER:
        return characters.get(appearance.characterId).get('name');
      case PRODUCT:
        return products.get(appearance.productId).get('shortName');
      default:
        return '';
    }
  }
);

export default (state) => ({
  // Map of <sceneId, isSimilar>.
  isSimilarScenes: isSimilarScenesSelector(state),
  scenes: scenesSelector(state),
  title: titleSelector(state)
});
