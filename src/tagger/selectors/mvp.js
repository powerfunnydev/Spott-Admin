import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import { currentVideoSelector, visibleScenesSelector as dataVisibleScenesSelector } from './common';

export const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'mvp', 'currentSceneId' ]);
export const enlargeFrameSelector = (state) => state.getIn([ 'tagger', 'tagger', 'mvp', 'enlargeFrame' ]);
export const hideNonKeyFramesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'mvp', 'hideNonKeyFrames' ]);
export const scaleSelector = (state) => state.getIn([ 'tagger', 'tagger', 'mvp', 'scale' ]);
export const hideSceneGroupSelector = (state) => state.getIn([ 'tagger', 'tagger', 'mvp', 'hideSceneGroup' ]);

export const visibleScenesSelector = createSelector(
  currentVideoSelector,
  dataVisibleScenesSelector,
  hideNonKeyFramesSelector,
  (video, scenes, hideNonKeyFrames) => (
    scenes
      .map((f) => f.set('isKeyFrame', video.get('keySceneId') === f.get('id')))
      .filter((f) => !hideNonKeyFrames || f.get('isKeyFrame'))
  )
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

export default createStructuredSelector({
  currentScene: currentSceneSelector,
  enlargeFrame: enlargeFrameSelector,
  hideNonKeyFrames: hideNonKeyFramesSelector,
  numKeyFrames: numKeyFramesSelector,
  scale: scaleSelector,
  scenes: visibleScenesSelector
});
