import { List, Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes';

/**
  * The app reducer is responsible for storing the id of the current selected
  * medium, video and scene. We also store the previous scene id, to be
  * able to revert state if an error occured when selecting a scene. We also Store
  * the current selected tab in the sidebar.
  *
  * app
  * -> characterSearchString
  * -> currentSceneId
  * -> currentScenImageId
  * -> currentMediumId
  * -> currentTabName
  * -> currentVideoId
  * -> globalProductSearchString
  * -> hideDifferentFrames
  * -> hideHiddenFrames
  * -> hoveredAppearance
  * -> previousSceneId
  * -> previousSceneImageId
  * -> productSearchString
  * -> selectedAppearance
  */
export default (state = Map({ currentTabName: 'frame', hideDifferentFrames: false, hideHiddenFrames: true }), action) => {
  switch (action.type) {
    case actionTypes.SEARCH_CHARACTERS_START:
      return state.set('characterSearchString', action.searchString);
    case actionTypes.SEARCH_PRODUCTS_START:
      return state.set('productSearchString', action.searchString);
    case actionTypes.SEARCH_GLOBAL_PRODUCTS_START:
      return state.set('globalProductSearchString', action.searchString);
    case actionTypes.MEDIUM_FETCH_START:
      return state.set('currentMediumId', action.mediumId);
    case actionTypes.VIDEO_FETCH_START:
      return state.set('currentVideoId', action.videoId);

    case actionTypes.MODAL_OPEN_UPDATE_PRODUCT_MARKER:
      return state.set('updateAppearanceId', action.appearanceId);

    // Select the first scene, when the video and it's scenes has fetched successfully.
    case actionTypes.SCENE_SELECT_START:
      // Store the previousScene(Image)Id to restore the previous selected scene
      // if something went wrong, when fetching the characters or products.
      return state.set('previousSceneId', state.get('currentSceneId'))
        .set('previousSceneImageId', state.get('currentSceneImageId'));
    case actionTypes.SCENE_SELECT_ERROR:
      // Restore the currentScene(Image)Id when something went wrong, when fetching
      // the characters or products of the current scene.
      return state.set('currentSceneId', state.get('previousSceneId'))
        .set('currentSceneImageId', state.get('previousSceneImageId'));
    case actionTypes.VIDEO_SELECT_ERROR:
      // TODO: handle major error.
      // Failed to bootstrap application, ask the user to refresh the page,
      // show a popup with more instructions
      return state.delete('currentVideoId');
    case actionTypes.CURRENT_SCENE_UPDATE:
      return state.set('currentSceneId', action.record && action.record.get('id'))
        .set('currentSceneImageId', action.record && action.record.get('imageId'));

    // Update the current tab name
    case actionTypes.SIDEBAR_CURRENT_SET_TAB_NAME:
      return state.set('currentTabName', action.currentTabName);

    case actionTypes.UPDATE_PRODUCT_MARKER_CANCEL:
      return state.delete('updateAppearanceId');

    case actionTypes.APPEARANCE_HOVER:
      return state.set('hoveredAppearance', action.appearanceId);
    case actionTypes.APPEARANCE_LEAVE:
      return state.delete('hoveredAppearance');
    case actionTypes.APPEARANCE_SELECT:
      return state.set('selectedAppearance', action.appearanceId);
    case actionTypes.APPEARANCE_TOGGLE_SELECT:
      return state.set('selectedAppearance', state.get('selectedAppearance') === action.appearanceId ? null : action.appearanceId);
    case actionTypes.SCENE_SELECT_SUCCESS:
      // We succesfully changed from scene, clear selection and hover
      return state.delete('hoveredAppearance').delete('selectedAppearance');

    case actionTypes.APPEARANCE_COPY:
      return state.set('copyAppearanceId', action.appearanceId);

    case actionTypes.TOGGLE_HIDE_DIFFERENT_FRAMES:
      return state.set('hideDifferentFrames', !state.get('hideDifferentFrames'));

    default:
      return state;
  }
};
