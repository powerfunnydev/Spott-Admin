import { List, Map } from 'immutable';
import * as actions from '../actions/organizer';

/**
  * organizer
  * -> currentSceneId
  * -> enlargeScene
  * -> hideHiddenFrames
  * -> hideSceneGroup
  * -> scale
  * -> showHotKeysInfo
  */
export default (state = Map({ enlargeScene: false, hideHiddenFrames: false, hideSceneGroup: Map({}), scale: 6, showHotKeysInfo: true }), action) => {
  switch (action.type) {
    case actions.TOGGLE_HOT_KEYS_INFO:
      return state.set('showHotKeysInfo', !state.get('showHotKeysInfo'));
    case actions.TOGGLE_SCENE_SIZE:
      return state.set('enlargeScene', !state.get('enlargeScene'));
    case actions.MINIMIZE_SCENE:
      return state.set('enlargeScene', false);
    case actions.SCALE_UPDATE:
      return state.set('scale', action.scale);

    case actions.TOGGLE_VISIBILITY_SCENE_GROUP:
      return state.setIn([ 'hideSceneGroup', action.sceneGroupId ], !state.getIn([ 'hideSceneGroup', action.sceneGroupId ]));

    case actions.TOGGLE_HIDE_HIDDEN_FRAMES:
      return state.set('hideHiddenFrames', !state.get('hideHiddenFrames'));
    case actions.CURRENT_SCENE_UPDATE:
      return state.set('currentSceneId', action.sceneId);
    default:
      return state;
  }
};
