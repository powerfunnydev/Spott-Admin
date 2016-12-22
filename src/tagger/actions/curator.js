import { postScene } from '../api/scene';
import { updateRecordStart, updateRecordSuccess, updateRecordError } from '../actions/_utils';
import {
  currentVideoIdSelector
} from '../selectors/common';
import { currentSceneSelector, currentSceneIdSelector, hideHiddenFramesSelector, scaleSelector, sceneGroupsSelector, visibleScenesSelector, showHotKeysInfoSelector } from '../selectors/organizer';
import { apiBaseUrlSelector, authenticationTokenSelector, currentLocaleSelector } from '../../selectors/global';

export const TOGGLE_FRAME_SIZE = 'CURATOR/TOGGLE_FRAME_SIZE';
export const TOGGLE_HIDE_NON_KEY_FRAMES = 'CURATOR/TOGGLE_HIDE_NON_KEY_FRAMES';
export const MINIMIZE_FRAME = 'CURATOR/MINIMIZE_FRAME';
export const CURRENT_FRAME_UPDATE = 'CURATOR/CURRENT_FRAME_UPDATE';
export const FRAME_UPDATE_START = 'CURATOR/FRAME_UPDATE_START';
export const FRAME_UPDATE_SUCCESS = 'CURATOR/FRAME_UPDATE_SUCCESS';
export const FRAME_UPDATE_ERROR = 'CURATOR/FRAME_UPDATE_ERROR';

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

function _buildSceneHasSceneGroupHash (sceneGroups) {
  const sceneHasSceneGroup = {};
  for (let i = 0; i < sceneGroups.size; i++) {
    const sceneGroup = sceneGroups.get(i);
    const sceneGroupScenes = sceneGroup.get('scenes');
    for (let j = 0; j < sceneGroupScenes.size; j++) {
      const scene = sceneGroupScenes.get(j);
      sceneHasSceneGroup[scene.get('id')] = {
        indexSceneGroups: i,
        indexSceneGroupScenes: j,
        sceneGroupId: sceneGroup.get('id')
      };
    }
  }
  return sceneHasSceneGroup;
}

export function selectBottomScene () {
  return (dispatch, getState) => {
    const state = getState();
    const sceneGroups = sceneGroupsSelector(state);
    const currentScene = currentSceneSelector(state);
    const numScenesPerRow = 13 - scaleSelector(state);

    if (!currentScene) {
      return;
    }

    const sceneHasSceneGroup = _buildSceneHasSceneGroupHash(sceneGroups);

    const { indexSceneGroups, indexSceneGroupScenes } = sceneHasSceneGroup[currentScene.get('id')];
    const currentSceneGroupScenes = sceneGroups.getIn([ indexSceneGroups, 'scenes' ]);
    const newIndex = indexSceneGroupScenes + numScenesPerRow;
    const newScene = currentSceneGroupScenes.get(newIndex);

    // We found a scene in the same scene group!
    if (newScene) {
      return dispatch(selectFrame(newScene));
    }

    // Check if there is a next row, so we can select the last scene of the next row.
    const currentRow = Math.ceil((indexSceneGroupScenes + 1) / numScenesPerRow);
    const lastSceneRow = Math.ceil(currentSceneGroupScenes.size / numScenesPerRow);

    // If the last scene of the scene group is not on the same row of the current scene,
    // then we can select the last scene of the current scene group.
    if (currentRow !== lastSceneRow) {
      return dispatch(selectFrame(currentSceneGroupScenes.last()));
    }

    // Take the x'th scene of the next scene group.
    const jumpToIndex = indexSceneGroupScenes % numScenesPerRow;
    for (let i = indexSceneGroups + 1; i < sceneGroups.size; i++) {
      // Try to take the x'th scene, or the first scene.
      const jumpToScene = sceneGroups.getIn([ i, 'scenes', jumpToIndex ]) || sceneGroups.getIn([ i, 'scenes', 0 ]);
      if (jumpToScene) {
        return dispatch(selectFrame(jumpToScene));
      }
    }
  };
}

export function selectTopScene () {
  return (dispatch, getState) => {
    const state = getState();
    const sceneGroups = sceneGroupsSelector(state);
    const currentScene = currentSceneSelector(state);
    const numScenesPerRow = 13 - scaleSelector(state);

    if (!currentScene) {
      return;
    }

    const sceneHasSceneGroup = _buildSceneHasSceneGroupHash(sceneGroups);

    const { indexSceneGroups, indexSceneGroupScenes } = sceneHasSceneGroup[currentScene.get('id')];
    const currentSceneGroupScenes = sceneGroups.getIn([ indexSceneGroups, 'scenes' ]);
    const newIndex = indexSceneGroupScenes - numScenesPerRow; // UPDATE: - instead of +

    // We found a scene in the same scene group!
    if (0 <= newIndex) {
      return dispatch(selectFrame(currentSceneGroupScenes.get(newIndex)));
    }

    // Take the x'th scene of the previous scene group.
    const column = indexSceneGroupScenes % numScenesPerRow;
    for (let i = indexSceneGroups - 1; i >= 0; i--) { // UPDATE: - instead +
      // rows - 1
      const fullRows = Math.ceil(sceneGroups.getIn([ i, 'scenes' ]).size / numScenesPerRow) - 1;
      const jumpToIndex = (fullRows * numScenesPerRow) + column;
      // Try to take the x'th scene, or the first scene.
      const jumpToScene = sceneGroups.getIn([ i, 'scenes', jumpToIndex ]) || sceneGroups.getIn([ i, 'scenes' ]).last();
      if (jumpToScene) {
        return dispatch(selectFrame(jumpToScene));
      }
    }
  };
}

export function toggleHideNonKeyFrames () {
  return async (dispatch, getState) => {
    const state = getState();
    const currentScene = currentSceneSelector(state);
    const hideHiddenScenes = hideHiddenFramesSelector(state);

    // When hiding the hidden frames, and the current scene was hidden, then deselect the current scene.
    // We inverse hideHiddenScenes, because it's not adjusted yet.
    if (!hideHiddenScenes && currentScene && currentScene.get('hidden')) {
      dispatch(selectFrame(null));
    }

    dispatch({ type: TOGGLE_HIDE_NON_KEY_FRAMES });
  };
}

// Toggle the visibility of the current scene or the scene that was provided.
export function toggleKeyFrame (scene) {
  return async (dispatch, getState) => {
    const state = getState();
    const authenticationToken = authenticationTokenSelector(state);
    const apiBaseUrl = apiBaseUrlSelector(state);
    const locale = currentLocaleSelector(state);

    const currentScene = scene || currentSceneSelector(state);

    // Do nothing if there is no scene selected.
    if (!currentScene) {
      return;
    }

    const hideHiddenScenes = hideHiddenFramesSelector(state);
    const nextScene = getNextScene(state, scene);
    const args = {
      videoId: currentVideoIdSelector(state),
      sceneId: currentScene.get('id')
    };

    dispatch(updateRecordStart(FRAME_UPDATE_START, currentScene, args));

    try {
      const updatedScene = await postScene(apiBaseUrl, authenticationToken, locale, args, { hidden: !currentScene.get('hidden') });
      dispatch(updateRecordSuccess(FRAME_UPDATE_SUCCESS, updatedScene, args));
      // When hiding the hidden frames, and the current scene was hidden, then select the right scene.
      if (hideHiddenScenes && updatedScene.hidden) {
        dispatch(selectFrame(nextScene));
      }
    } catch (error) {
      dispatch(updateRecordError(FRAME_UPDATE_ERROR, error, args));
    }
  };
}

export function selectFirstScene () {
  return async (dispatch, getState) => {
    const state = getState();
    const firstScene = visibleScenesSelector(state).first();

    // If all frames are hidden, there is no first scene to select.
    if (firstScene) {
      await dispatch(selectFrame(firstScene));
    }
  };
}
