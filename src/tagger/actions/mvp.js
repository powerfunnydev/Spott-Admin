import { currentVideoSelector } from '../selectors/common';
import { currentSceneSelector, currentSceneIdSelector, scaleSelector, hideNonKeyFramesSelector, visibleScenesSelector } from '../selectors/mvp';
import { fetchVideo as dataFetchVideo, persistVideo as dataPersistVideo } from './video';

export const TOGGLE_FRAME_SIZE = 'MVP/TOGGLE_FRAME_SIZE';
export const TOGGLE_HIDE_NON_KEY_FRAMES = 'MVP/TOGGLE_HIDE_NON_KEY_FRAMES';
export const MINIMIZE_FRAME = 'MVP/MINIMIZE_FRAME';
export const CURRENT_FRAME_UPDATE = 'MVP/CURRENT_FRAME_UPDATE';
export const FRAME_UPDATE_START = 'MVP/FRAME_UPDATE_START';
export const FRAME_UPDATE_SUCCESS = 'MVP/FRAME_UPDATE_SUCCESS';
export const FRAME_UPDATE_ERROR = 'MVP/FRAME_UPDATE_ERROR';

export const SCALE_UPDATE = 'MVP/SCALE_UPDATE';

export function toggleFrameSize () {
  return { type: TOGGLE_FRAME_SIZE };
}

export function minimizeFrame () {
  return { type: MINIMIZE_FRAME };
}

export function updateScale (scale) {
  return { scale, type: SCALE_UPDATE };
}

// Helper functions
// ----------------

function getSceneRelativeToCurrentScene (state, indexJump) {
  const scenes = visibleScenesSelector(state);
  const currentScene = currentSceneSelector(state);

  // Determine the number of scenes.
  const numScenes = scenes.size;
  // Get the index of the current scene in the list of scenes.
  const currentSceneIndex = scenes.indexOf(currentScene);

  const newSceneIndex = currentSceneIndex + indexJump;
  // If the new index is not between the ranges, return nothing.
  if (newSceneIndex < 0 || numScenes <= newSceneIndex) {
    return;
  }

  // Retrieve the new selected scene from the entities Map.
  return scenes.get(newSceneIndex);
}

export function getNextScene (state, scene) {
  const scenes = visibleScenesSelector(state);
  const currentScene = currentSceneSelector(state);

  // Get the index of the current scene in the list of scenes.
  const currentSceneIndex = scenes.indexOf(scene || currentScene);
  // Jump to the right scene, if there is no right scene, jump to the left scene.
  const nextScene = scenes.get(currentSceneIndex + 1) || scenes.get(currentSceneIndex - 1);
  return currentScene === nextScene ? null : nextScene;
}

// // Select the scene
// // ----------------

export function selectFrame (scene) {
  return { sceneId: scene && scene.get('id'), type: CURRENT_FRAME_UPDATE };
}

export function selectLeftFrame () {
  return (dispatch, getState) => {
    const newScene = getSceneRelativeToCurrentScene(getState(), -1);
    newScene && dispatch(selectFrame(newScene));
  };
}

export function selectRightFrame () {
  return (dispatch, getState) => {
    const newScene = getSceneRelativeToCurrentScene(getState(), 1);
    newScene && dispatch(selectFrame(newScene));
  };
}

export function selectTopFrame () {
  return (dispatch, getState) => {
    const state = getState();
    const numScenesPerRow = 13 - scaleSelector(state);
    const newScene = getSceneRelativeToCurrentScene(state, -numScenesPerRow);
    newScene && dispatch(selectFrame(newScene));
  };
}

export function selectBottomFrame () {
  return (dispatch, getState) => {
    const state = getState();
    const numScenesPerRow = 13 - scaleSelector(state);
    const newScene = getSceneRelativeToCurrentScene(state, numScenesPerRow);
    newScene && dispatch(selectFrame(newScene));
  };
}

export function toggleHideNonKeyFrames () {
  return async (dispatch, getState) => {
    const state = getState();
    const currentSceneId = currentSceneIdSelector(state);
    const hideNonKeyFrames = hideNonKeyFramesSelector(state);

    // When hiding the non key frames, and the current scene was not the key frame,
    // then deselect it.
    // We inverse hideNonKeyFrames, because it's not adjusted yet.
    // if (!hideNonKeyFrames && currentSceneGroup && (currentSceneGroup.get('keySceneId') !== currentSceneId)) {
    //   dispatch(selectFrame(null));
    // }

    dispatch({ type: TOGGLE_HIDE_NON_KEY_FRAMES });
  };
}

// Make frame key frame or not.
export function toggleKeyFrame (scene) {
  return async (dispatch, getState) => {
    const state = getState();
    const currentVideo = currentVideoSelector(state);
    // When using HotKeys no scene is provided to the action call.
    const currentScene = scene || currentSceneSelector(state);

    // Do nothing if there is no scene selected.
    if (!currentScene) {
      return;
    }

    const hideNonKeyFrames = hideNonKeyFramesSelector(state);

    await dispatch(dataPersistVideo({
      keySceneId: currentVideo.get('keySceneId') === currentScene.get('id') ? null : currentScene.get('id'),
      videoId: currentVideo.get('id')
    }));
    await dispatch(dataFetchVideo({ videoId: currentVideo.get('id') }));

    // When non key frames are hidden and the current scene was a non key frame,
    // deselect the frame.
    if (currentVideo.get('keySceneId') && hideNonKeyFrames) {
      dispatch(selectFrame(null));
    }
  };
}

export function selectFirstScene () {
  return (dispatch, getState) => {
    const state = getState();
    const firstScene = visibleScenesSelector(state).first();
    // Select or deselect frame.
    dispatch(selectFrame(firstScene));
  };
}
