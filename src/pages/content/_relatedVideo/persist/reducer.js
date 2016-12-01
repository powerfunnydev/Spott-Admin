import { fromJS } from 'immutable';
import * as actions from './actions';

export default (state = fromJS({ videoHasProgress: {} }), action) => {
  switch (action.type) {
    case actions.CREATE_VIDEO_START:
      return state.setIn([ 'videoHasProgress', action.externalReference ], fromJS(action.data));
    case actions.CREATE_VIDEO_PROGRESS:
      return state.mergeIn([ 'videoHasProgress', action.externalReference ], fromJS(action.data));
    case actions.CREATE_VIDEO_SUCCESS:
      return state.mergeIn([ 'videoHasProgress', action.externalReference ], fromJS(action.data));
    case actions.CREATE_VIDEO_ERROR:
      return state.deleteIn([ 'videoHasProgress', action.externalReference ]);
    default:
      return state;
  }
};
