import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  createEntitiesByRelationSelector,
  currentVideoIdSelector,
  characterEntitiesSelector,
  sceneEntitiesSelector,
  videoHasScenesRelationsSelector,
  videoHasSceneGroupsRelationsSelector,
  sceneGroupEntitiesSelector
 } from './common';
import { mediumCharactersSelector } from './quickiesBar/charactersTab';

const _sceneGroupsSelector = createEntitiesByRelationSelector(videoHasSceneGroupsRelationsSelector, currentVideoIdSelector, sceneGroupEntitiesSelector);

export const currentCharacterIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentCharacterId' ]);
export const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentSceneId' ]);
export const currentSceneGroupIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'currentSceneGroupId' ]);
export const enlargeFrameSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'enlargeFrame' ]);
export const hideNonKeyFramesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'hideNonKeyFrames' ]);
export const scaleSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'scale' ]);
export const hideSceneGroupSelector = (state) => state.getIn([ 'tagger', 'tagger', 'curator', 'hideSceneGroup' ]);

export const currentSceneSelector = createSelector(
  currentSceneIdSelector,
  sceneEntitiesSelector,
  (sceneId, scenes) => (sceneId && scenes ? scenes.get(sceneId) : null)
);

export const currentCharacterSelector = createSelector(
  currentCharacterIdSelector,
  characterEntitiesSelector,
  (characterId, characters) => (characterId && characters ? characters.get(characterId) : null)
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
  hideNonKeyFramesSelector,
  (currentSceneGroup, hideNonKeyFrames) => {
    if (currentSceneGroup) {
      return currentSceneGroup
        .get('scenes')
        .filter((frame) => !frame.get('hidden') &&
          (!hideNonKeyFrames || currentSceneGroup.get('keySceneId') === frame.get('id')));
    }
    return List();
  }
);

const numAllScenesSelector = createSelector(
   allScenesSelector,
   (scenes) => scenes.size
 );

const numVisibleScenesSelector = createSelector(
  allScenesSelector,
  (scenes, hideHiddenFrames) => scenes.filter((s) => !s.get('hidden')).size
);

export const sidebarSelector = createStructuredSelector({
  characters: mediumCharactersSelector,
  currentCharacter: currentCharacterSelector,
  currentSceneGroup: currentSceneGroupSelector,
  sceneGroups: sceneGroupsSelector
});

export default createStructuredSelector({
  currentScene: currentSceneSelector,
  currentSceneGroup: currentSceneGroupSelector,
  enlargeFrame: enlargeFrameSelector,
  hideNonKeyFrames: hideNonKeyFramesSelector,
  hideSceneGroup: hideSceneGroupSelector,
  numAllScenes: numAllScenesSelector,
  numVisibleScenes: numVisibleScenesSelector,
  scale: scaleSelector,
  scenes: visibleScenesSelector
});
