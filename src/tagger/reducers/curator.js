import { Map } from 'immutable';
import * as actions from '../actions/curator';

/**
  * organizer
  * -> currentSceneId
  * -> enlargeFrame
  * -> hideNonKeyFrames
  * -> scale
  */
export default (state = Map({ enlargeFrame: false, hideNonKeyFrames: false, scale: 6 }), action) => {
  switch (action.type) {
    case actions.TOGGLE_FRAME_SIZE:
      return state.set('enlargeFrame', !state.get('enlargeFrame'));
    case actions.MINIMIZE_FRAME:
      return state.set('enlargeFrame', false);
    case actions.SCALE_UPDATE:
      return state.set('scale', action.scale);

    case actions.TOGGLE_HIDE_NON_KEY_FRAMES:
      return state.set('hideNonKeyFrames', !state.get('hideNonKeyFrames'));
    case actions.CURRENT_FRAME_UPDATE:
      return state.set('currentSceneId', action.sceneId);
    default:
      return state;
  }
};
