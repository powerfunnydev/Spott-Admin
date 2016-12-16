import { createSelector } from 'reselect';
import { List } from 'immutable';
import {
  currentSceneIdSelector,
  currentVideoIdSelector,
  hideDifferentFramesSelector,
  sceneEntitiesSelector,
  videoHasScenesRelationsSelector
 } from './common';

export const currentSceneSelector = createSelector(
  currentSceneIdSelector,
  sceneEntitiesSelector,
  (sceneId, scenes) => (sceneId && scenes ? scenes.get(sceneId) : null)
);

/**
 * Extracts the scenes of the current video from the state tree.
 */
export const scenesSelector = createSelector(
   currentVideoIdSelector,
   currentSceneSelector,
   videoHasScenesRelationsSelector,
   sceneEntitiesSelector,
   hideDifferentFramesSelector,
   (videoId, currentScene, videoHasScenes, scenes, hideDifferentFrames) => {
     // videoHasScenes and scenes are always present, but can be empty Immutable Map's.
     const sceneIds = videoHasScenes.get(videoId) || List();
     const currentSimilarScenes = currentScene && currentScene.get('similarScenes') || []; // TODO refactor to List
     const currentSceneId = currentScene && currentScene.get('id');

     return sceneIds.reduce((sceneList, sceneId) => {
       const scene = scenes.get(sceneId);
       // Skip hidden scenes.
       if (scene.get('hidden')) {
         return sceneList;
       }

      // When hiding the different frames, we skip a scene if it does not belong
      // to the similar scenes of the current selected scene.
       if (hideDifferentFrames && !currentSimilarScenes.includes(sceneId) && sceneId !== currentSceneId) {
         return sceneList;
       }

       return sceneList.push(scene);
     }, List());
   }
 );

export default (state) => ({
  currentScene: currentSceneSelector(state),
  hideDifferentFrames: hideDifferentFramesSelector(state),
  scenes: scenesSelector(state)
});
