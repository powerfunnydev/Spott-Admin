import { fromJS } from 'immutable';
import * as actions from '../actions/global';

/**
  * The global reducer is responsible for storing global aspects of this application.
  *
  * global
  * -> authenticationToken
  * -> currentModal (e.g., 'login')
  */
// TODO: remove hardcoded authenticationToken!
export default (state = fromJS({ configuration: {} }), action) => {
  switch (action.type) {
    case actions.AUTHENTICATE:
      return state
        .set('authenticationToken', action.authenticationToken)
        .set('username', action.username);
    case actions.CONFIGURE:
      return state.mergeIn([ 'configuration' ], fromJS(action.configuration));
    case actions.MODAL_OPEN_LOGIN:
      return state.set('currentModal', 'login');
    case actions.MODAL_CLOSE:
      return state.delete('currentModal');
    default:
      return state;
  }
};
