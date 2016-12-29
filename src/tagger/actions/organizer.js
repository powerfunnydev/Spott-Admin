import { postScene } from '../api/scene';
import { updateRecordStart, updateRecordSuccess, updateRecordError } from '../actions/_utils';
import { deleteSceneGroup as dataDeleteSceneGroup, persistSceneGroup as dataPersistSceneGroup, fetchSceneGroups as dataFetchSceneGroups } from './sceneGroup';
import {
  currentVideoIdSelector
} from '../selectors/common';
import { currentSceneSelector, currentSceneIdSelector, hideHiddenFramesSelector, scaleSelector, sceneGroupsSelector, visibleScenesSelector, showHotKeysInfoSelector } from '../selectors/organizer';
import { apiBaseUrlSelector, authenticationTokenSelector, currentLocaleSelector } from '../../selectors/global';

// Organizer actions
export const TOGGLE_HOT_KEYS_INFO = 'ORGANIZER/TOGGLE_HOT_KEYS_INFO';
export const TOGGLE_SCENE_SIZE = 'ORGANIZER/TOGGLE_SCENE_SIZE';
export const TOGGLE_HIDE_HIDDEN_FRAMES = 'ORGANIZER/TOGGLE_HIDE_HIDDEN_FRAMES';
export const MINIMIZE_SCENE = 'ORGANIZER/MINIMIZE_SCENE';
export const CURRENT_SCENE_UPDATE = 'ORGANIZER/CURRENT_SCENE_UPDATE';
export const SCENE_UPDATE_START = 'ORGANIZER/SCENE_UPDATE_START';
export const SCENE_UPDATE_SUCCESS = 'ORGANIZER/SCENE_UPDATE_SUCCESS';
export const SCENE_UPDATE_ERROR = 'ORGANIZER/SCENE_UPDATE_ERROR';

export const SCENE_GROUP_CREATE_SUCCESS = 'ORGANIZER/SCENE_GROUP_CREATE_SUCCESS';
export const SCENE_GROUP_DELETE_SUCCESS = 'ORGANIZER/SCENE_GROUP_DELETE_SUCCESS';

export const TOGGLE_VISIBILITY_SCENE_GROUP = 'ORGANIZER/TOGGLE_VISIBILITY_SCENE_GROUP';

export const SCALE_UPDATE = 'ORGANIZER/SCALE_UPDATE';

export function toggleHotKeysInfo () {
  return (dispatch, getState) => {
    // State is not yet updated, inverse boolean.
    const showHotKeysInfo = !showHotKeysInfoSelector(getState());
    const date = new Date();
    // Store in locale storage that the info should (not) be shown next time.
    if (localStorage) {
      if (showHotKeysInfo) {
        localStorage.removeItem('hotKeysInfoClosed');
      } else {
        localStorage.setItem('hotKeysInfoClosed', JSON.stringify(date));
      }
    }
    dispatch({ type: TOGGLE_HOT_KEYS_INFO });
  };
}

export function toggleSceneSize () {
  return { type: TOGGLE_SCENE_SIZE };
}

export function minimizeScene () {
  return { type: MINIMIZE_SCENE };
}

export function persistSceneGroup (sceneGroupData) {
  return async (dispatch, getState) => {
    const videoId = currentVideoIdSelector(getState());
    await dispatch(dataPersistSceneGroup(sceneGroupData));
    await dispatch(dataFetchSceneGroups({ videoId }));
  };
}

export function insertSceneGroup () {
  return async (dispatch, getState) => {
    const state = getState();
    const firstSceneId = currentSceneIdSelector(state);

    // Do nothing if no scene was selected.
    if (!firstSceneId) {
      return;
    }

    // Only insert a scene group if it's not the first scene.
    const sceneGroups = sceneGroupsSelector(state);
    for (const sceneGroup of sceneGroups) {
      const firstScene = sceneGroup.get('scenes').first();
      // Do nothing if it's the first scene of a scene group.
      if (firstScene && firstScene.get('id') === firstSceneId) {
        return;
      }
    }
    // Create a scene group if the current scene is not the first scene.
    await dispatch(persistSceneGroup({ firstSceneId }));
  };
}

export function removeSceneGroup (sceneGroupId) {
  return async (dispatch, getState) => {
    const videoId = currentVideoIdSelector(getState());
    await dispatch(dataDeleteSceneGroup({ sceneGroupId }));
    await dispatch(dataFetchSceneGroups({ videoId }));
  };
}

export function updateScale (scale) {
  return { scale, type: SCALE_UPDATE };
}

export function toggleVisibilitySceneGroup (sceneGroupId) {
  return { sceneGroupId, type: TOGGLE_VISIBILITY_SCENE_GROUP };
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

export function selectScene (scene) {
  return { sceneId: scene && scene.get('id'), type: CURRENT_SCENE_UPDATE };
}

export function selectLeftScene () {
  return (dispatch, getState) => {
    const newScene = getSceneRelativeToCurrentScene(getState(), -1);
    newScene && dispatch(selectScene(newScene));
  };
}

export function selectRightScene () {
  return (dispatch, getState) => {
    const newScene = getSceneRelativeToCurrentScene(getState(), 1);
    newScene && dispatch(selectScene(newScene));
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
      return dispatch(selectScene(newScene));
    }

    // Check if there is a next row, so we can select the last scene of the next row.
    const currentRow = Math.ceil((indexSceneGroupScenes + 1) / numScenesPerRow);
    const lastSceneRow = Math.ceil(currentSceneGroupScenes.size / numScenesPerRow);

    // If the last scene of the scene group is not on the same row of the current scene,
    // then we can select the last scene of the current scene group.
    if (currentRow !== lastSceneRow) {
      return dispatch(selectScene(currentSceneGroupScenes.last()));
    }

    // Take the x'th scene of the next scene group.
    const jumpToIndex = indexSceneGroupScenes % numScenesPerRow;
    for (let i = indexSceneGroups + 1; i < sceneGroups.size; i++) {
      // Try to take the x'th scene, or the first scene.
      const jumpToScene = sceneGroups.getIn([ i, 'scenes', jumpToIndex ]) || sceneGroups.getIn([ i, 'scenes', 0 ]);
      if (jumpToScene) {
        return dispatch(selectScene(jumpToScene));
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
      return dispatch(selectScene(currentSceneGroupScenes.get(newIndex)));
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
        return dispatch(selectScene(jumpToScene));
      }
    }
  };
}

export function toggleHideHiddenFrames () {
  return async (dispatch, getState) => {
    const state = getState();
    const currentScene = currentSceneSelector(state);
    const hideHiddenScenes = hideHiddenFramesSelector(state);

    // When hiding the hidden frames, and the current scene was hidden, then deselect the current scene.
    // We inverse hideHiddenScenes, because it's not adjusted yet.
    if (!hideHiddenScenes && currentScene && currentScene.get('hidden')) {
      dispatch(selectScene(null));
    }

    dispatch({ type: TOGGLE_HIDE_HIDDEN_FRAMES });
  };
}

// Toggle the visibility of the current scene or the scene that was provided.
export function toggleVisibilityScene (scene) {
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

    dispatch(updateRecordStart(SCENE_UPDATE_START, currentScene, args));

    try {
      const updatedScene = await postScene(apiBaseUrl, authenticationToken, locale, args, { hidden: !currentScene.get('hidden') });
      dispatch(updateRecordSuccess(SCENE_UPDATE_SUCCESS, updatedScene, args));
      // When hiding the hidden frames, and the current scene was hidden, then select the right scene.
      if (hideHiddenScenes && updatedScene.hidden) {
        dispatch(selectScene(nextScene));
      }
    } catch (error) {
      dispatch(updateRecordError(SCENE_UPDATE_ERROR, error, args));
    }
  };
}

export function selectFirstScene () {
  return async (dispatch, getState) => {
    const state = getState();
    const firstScene = visibleScenesSelector(state).first();

    // If all frames are hidden, there is no first scene to select.
    if (firstScene) {
      await dispatch(selectScene(firstScene));
    }
  };
}
