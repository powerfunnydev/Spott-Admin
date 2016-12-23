import { currentVideoIdSelector } from '../selectors/common';
import { currentSceneSelector, currentSceneIdSelector, scaleSelector, hideNonKeyFramesSelector, currentSceneGroupSelector, visibleScenesSelector } from '../selectors/curator';
import { fetchSceneGroups as dataFetchSceneGroups, persistSceneGroup as dataPersistSceneGroup } from './sceneGroup';

export const TOGGLE_FRAME_SIZE = 'CURATOR/TOGGLE_FRAME_SIZE';
export const TOGGLE_HIDE_NON_KEY_FRAMES = 'CURATOR/TOGGLE_HIDE_NON_KEY_FRAMES';
export const MINIMIZE_FRAME = 'CURATOR/MINIMIZE_FRAME';
export const CURRENT_FRAME_UPDATE = 'CURATOR/CURRENT_FRAME_UPDATE';
export const FRAME_UPDATE_START = 'CURATOR/FRAME_UPDATE_START';
export const FRAME_UPDATE_SUCCESS = 'CURATOR/FRAME_UPDATE_SUCCESS';
export const FRAME_UPDATE_ERROR = 'CURATOR/FRAME_UPDATE_ERROR';

export const SELECT_SCENE_GROUP = 'CURATOR/SELECT_SCENE_GROUP';

export const TOGGLE_VISIBILITY_FRAME_GROUP = 'CURATOR/TOGGLE_VISIBILITY_FRAME_GROUP';

export const SCALE_UPDATE = 'CURATOR/SCALE_UPDATE';

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
    const currentSceneGroup = currentSceneGroupSelector(state);
    const currentSceneId = currentSceneIdSelector(state);
    const hideNonKeyFrames = hideNonKeyFramesSelector(state);

    // When hiding the non key frames, and the current scene was not the key frame,
    // then deselect it.
    // We inverse hideNonKeyFrames, because it's not adjusted yet.
    if (!hideNonKeyFrames && currentSceneGroup && (currentSceneGroup.get('keySceneId') !== currentSceneId)) {
      dispatch(selectFrame(null));
    }

    dispatch({ type: TOGGLE_HIDE_NON_KEY_FRAMES });
  };
}

export function persistSceneGroup (sceneGroupData) {
  return async (dispatch, getState) => {
    const videoId = currentVideoIdSelector(getState());
    const newSceneGroup = await dispatch(dataPersistSceneGroup(sceneGroupData));
    await dispatch(dataFetchSceneGroups({ videoId }));
    return newSceneGroup;
  };
}

// Make frame key frame or not.
export function toggleKeyFrame (scene) {
  return async (dispatch, getState) => {
    const state = getState();

    const currentSceneGroup = currentSceneGroupSelector(state);
    // When using HotKeys no scene is provided.
    const currentScene = scene || currentSceneSelector(state);

    // Do nothing if there is no scene selected.
    if (!currentScene || !currentSceneGroup) {
      return;
    }

    const hideNonKeyFrames = hideNonKeyFramesSelector(state);
    const nextScene = getNextScene(state, scene);

    const updatedSceneGroup = await dispatch(persistSceneGroup({
      ...currentSceneGroup.toJS(),
      keySceneId: currentSceneGroup.get('keySceneId') === currentScene.get('id') ? null : currentScene.get('id')
    }));

    // When non key frames are hiiden and the current scene was a non key frame,
    // then select the right scene.
    if (hideNonKeyFrames && !updatedSceneGroup.keySceneId) {
      dispatch(selectFrame(nextScene));
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

export function selectSceneGroup (sceneGroupId) {
  return (dispatch) => {
    dispatch({ sceneGroupId, type: SELECT_SCENE_GROUP });
    dispatch(selectFirstScene());
  };
}
