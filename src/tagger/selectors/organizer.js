import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import {
  createEntitiesByRelationSelector,
  currentVideoIdSelector,
  sceneEntitiesSelector,
  videoHasScenesRelationsSelector,
  videoHasSceneGroupsRelationsSelector,
  sceneGroupEntitiesSelector
 } from './common';

const _sceneGroupsSelector = createEntitiesByRelationSelector(videoHasSceneGroupsRelationsSelector, currentVideoIdSelector, sceneGroupEntitiesSelector);

export const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'organizer', 'currentSceneId' ]);
export const enlargeSceneSelector = (state) => state.getIn([ 'tagger', 'tagger', 'organizer', 'enlargeScene' ]);
export const hideHiddenFramesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'organizer', 'hideHiddenFrames' ]);
export const showHotKeysInfoSelector = (state) => state.getIn([ 'tagger', 'tagger', 'organizer', 'showHotKeysInfo' ]);
export const scaleSelector = (state) => state.getIn([ 'tagger', 'tagger', 'organizer', 'scale' ]);
export const hideSceneGroupSelector = (state) => state.getIn([ 'tagger', 'tagger', 'organizer', 'hideSceneGroup' ]);

export const currentSceneSelector = createSelector(
  currentSceneIdSelector,
  sceneEntitiesSelector,
  (sceneId, scenes) => (sceneId && scenes ? scenes.get(sceneId) : null)
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

/**
 * Extracts the scenes of the current video from the state tree.
 */
export const visibleScenesSelector = createSelector(
   allScenesSelector,
   hideHiddenFramesSelector,
   (scenes, hideHiddenFrames) => hideHiddenFrames ? scenes.filter((s) => !s.get('hidden')) : scenes
);

export const sceneGroupsSelector = createSelector(
   _sceneGroupsSelector,
   allScenesSelector,
   hideHiddenFramesSelector,
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

const numAllScenesSelector = createSelector(
   allScenesSelector,
   (scenes) => scenes.size
 );

const numVisibleScenesSelector = createSelector(
  allScenesSelector,
  (scenes, hideHiddenFrames) => scenes.filter((s) => !s.get('hidden')).size
);

export default createStructuredSelector({
  currentScene: currentSceneSelector,
  enlargeScene: enlargeSceneSelector,
  hideHiddenFrames: hideHiddenFramesSelector,
  hideSceneGroup: hideSceneGroupSelector,
  numAllScenes: numAllScenesSelector,
  numVisibleScenes: numVisibleScenesSelector,
  scale: scaleSelector,
  scenes: visibleScenesSelector,
  sceneGroups: sceneGroupsSelector,
  showHotKeysInfo: showHotKeysInfoSelector
});
