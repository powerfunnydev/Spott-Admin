import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  appearanceEntitiesSelector,
  characterEntitiesSelector,
  characterHasAppearancesRelationsSelector,
  createEntitiesByRelationSelector,
  currentVideoIdSelector,
  sceneEntitiesSelector,
  videoHasCharactersRelationsSelector,
  videoHasScenesRelationsSelector,
  videoHasSceneGroupsRelationsSelector,
  sceneGroupEntitiesSelector,
  videoHasProductsRelationsSelector,
  productEntitiesSelector,
  productHasAppearancesRelationsSelector
 } from './common';

export const currentCharacterIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentCharacterId' ]);
export const currentProductIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentProductId' ]);
export const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentSceneId' ]);
export const currentSceneGroupIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentSceneGroupId' ]);
export const enlargeFrameSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'enlargeFrame' ]);
export const hideNonKeyFramesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'hideNonKeyFrames' ]);
export const scaleSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'scale' ]);
export const hideSceneGroupSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'hideSceneGroup' ]);

const _sceneGroupsSelector = createEntitiesByRelationSelector(videoHasSceneGroupsRelationsSelector, currentVideoIdSelector, sceneGroupEntitiesSelector);
export const characterAppearancesSelector = createEntitiesByRelationSelector(characterHasAppearancesRelationsSelector, currentCharacterIdSelector, appearanceEntitiesSelector);
export const productAppearancesSelector = createEntitiesByRelationSelector(productHasAppearancesRelationsSelector, currentProductIdSelector, appearanceEntitiesSelector);
export const videoCharactersSelector = createEntitiesByRelationSelector(videoHasCharactersRelationsSelector, currentVideoIdSelector, characterEntitiesSelector);
export const videoProductsSelector = createEntitiesByRelationSelector(videoHasProductsRelationsSelector, currentVideoIdSelector, productEntitiesSelector);

const charactersSelector = createSelector(
  videoCharactersSelector,
  characterHasAppearancesRelationsSelector,
  appearanceEntitiesSelector,
  (characters, charactersHasAppearances, appearancesById) => (
    characters.get('data').map((c) => {
      const appearanceIds = charactersHasAppearances.getIn([ c.get('id'), 'data' ]) || List();
      const countKeyAppearances = appearanceIds.reduce((i, id) => {
        const a = appearancesById.get(id);
        return a && a.get('keyAppearance') ? i + 1 : i;
      }, 0);
      return c.set('countKeyAppearances', countKeyAppearances);
    })
  )
);

const productsSelector = createSelector(
  videoProductsSelector,
  productHasAppearancesRelationsSelector,
  appearanceEntitiesSelector,
  (products, productHasAppearances, appearancesById) => {
    return products.get('data').map((p) => {
      const appearanceIds = productHasAppearances.getIn([ p.get('id'), 'data' ]) || List();
      const countKeyAppearances = appearanceIds.reduce((i, id) => {
        const a = appearancesById.get(id);
        return a && a.get('keyAppearance') ? i + 1 : i;
      }, 0);
      return p.set('countKeyAppearances', countKeyAppearances);
    });
  }
);

export const currentCharacterSelector = createSelector(
  currentCharacterIdSelector,
  charactersSelector,
  (characterId, characters) => characters.find((c) => c.get('id') === characterId)
);

export const currentProductSelector = createSelector(
  currentProductIdSelector,
  productsSelector,
  (productId, products) => products.find((p) => p.get('id') === productId)
);

export const allScenesSelector = createSelector(
   currentVideoIdSelector,
   videoHasScenesRelationsSelector,
   sceneEntitiesSelector,
   (videoId, videoHasScenes, scenes) => {
     const sceneIds = videoHasScenes.get(videoId) || List();
     return sceneIds.map((sceneId) => scenes.get(sceneId));
   }
 );

export const sceneGroupsSelector = createSelector(
   _sceneGroupsSelector,
   allScenesSelector,
   hideNonKeyFramesSelector,
   (sceneGroups, scenes, hideHiddenFrames) => {
     let result = sceneGroups.get('data');
     const firstScene = scenes.first();
     const firstSceneGroup = result.first();

     // Create a scene group if there is at least one scene AND
     // 1) there are no scene groups OR
     // 2) the first scene does not have a scene group.
     if (firstScene && (!firstSceneGroup || firstScene.get('id') !== firstSceneGroup.get('firstSceneId'))) {
       result = result.unshift(Map({ firstSceneId: firstScene.get('id'), id: 'fake', scenes: List() }));
     }

     // Maps a scene id (first scene id of a scene group) to an scene group index.
     const firstSceneIdOfSceneGroup = {};
     for (let i = 0; i < result.size; i++) {
       firstSceneIdOfSceneGroup[result.getIn([ i, 'firstSceneId' ])] = i;
     }

     let i = 0;
     for (const scene of scenes) {
       // Jump to the correct scene group.
       // Check if the current scene is the first scene of a group,
       // if not take the previous scene group.
       i = firstSceneIdOfSceneGroup[scene.get('id')] || i;

       if (!hideHiddenFrames || !scene.get('hidden')) {
         result = result.setIn([ i, 'scenes' ], result.getIn([ i, 'scenes' ]).push(scene));
       }
     }

     return result;
   }
 );

export const currentSceneGroupSelector = createSelector(
   currentSceneGroupIdSelector,
   sceneGroupsSelector,
   (sceneGroupId, sceneGroups) => sceneGroups.find((sceneGroup) => sceneGroup.get('id') === sceneGroupId)
 );

export const visibleScenesSelector = createSelector(
  currentSceneGroupSelector,
  currentCharacterIdSelector,
  currentProductIdSelector,
  characterAppearancesSelector,
  productAppearancesSelector,
  sceneEntitiesSelector,
  hideNonKeyFramesSelector,
  (currentSceneGroup, currentCharacterId, currentProductId, characterAppearances, productAppearances, scenesById, hideNonKeyFrames) => {
    let result = List();
    if (currentSceneGroup) {
      result = currentSceneGroup
        .get('scenes')
        .map((f) => f.set('isKeyFrame', currentSceneGroup.get('keySceneId') === f.get('id')));
    }
    if (currentCharacterId) {
      result = characterAppearances
        .get('data')
        .map((a) => {
          return scenesById.get(a.get('sceneId')).set('appearance', a);
        })
        .filter((f) => f)
        .map((f) => f.set('isKeyFrame', f.getIn([ 'appearance', 'keyAppearance' ])));
    }
    if (currentProductId) {
      result = productAppearances
        .get('data')
        .map((a) => {
          return scenesById.get(a.get('sceneId')).set('appearance', a);
        })
        .filter((f) => f)
        .map((f) => f.set('isKeyFrame', f.getIn([ 'appearance', 'keyAppearance' ])));
    }
    return result
      .filter((f) => !f.get('hidden') &&
        (!hideNonKeyFrames || f.get('isKeyFrame')));
  }
);

export const currentSceneSelector = createSelector(
  currentSceneIdSelector,
  visibleScenesSelector,
  (sceneId, scenes) => scenes.find((s) => s.get('id') === sceneId)
);

const numKeyFramesSelector = createSelector(
   visibleScenesSelector,
   (visibleScenes) => visibleScenes.filter((f) => f.get('isKeyFrame')).size
 );

export const sidebarSelector = createStructuredSelector({
  characters: charactersSelector,
  currentCharacter: currentCharacterSelector,
  currentProduct: currentProductSelector,
  currentSceneGroup: currentSceneGroupSelector,
  products: productsSelector,
  sceneGroups: sceneGroupsSelector
});

export default createStructuredSelector({
  currentCharacter: currentCharacterSelector,
  currentProduct: currentProductSelector,
  currentScene: currentSceneSelector,
  currentSceneGroup: currentSceneGroupSelector,
  enlargeFrame: enlargeFrameSelector,
  hideNonKeyFrames: hideNonKeyFramesSelector,
  hideSceneGroup: hideSceneGroupSelector,
  numKeyFrames: numKeyFramesSelector,
  scale: scaleSelector,
  scenes: visibleScenesSelector
});
