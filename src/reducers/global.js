import { fromJS } from 'immutable';
import * as actions from '../actions/global';
import * as userActions from '../actions/user';

/**
  * The global reducer is responsible for storing global aspects of this application.
  *
  * global
  * -> authenticationToken
  * -> currentModal (e.g., 'login')
  * -> user (current user object)
  */
export default (state = fromJS({ authentication: {}, configuration: { currentLocale: 'en' } }), action) => {
  switch (action.type) {
    // User actions
    // ////////////
    case userActions.LOGIN_SUCCESS:
      return state.set('authentication', fromJS(action.data));
    case userActions.LOGOUT_SUCCESS:
      return state.set('authentication', null);

    // Global actions
    // //////////////
    case actions.CONFIGURE:
      return state.mergeIn([ 'configuration' ], fromJS(action.configuration));
    case actions.MODAL_OPEN:
      return state.set('currentModal', action.modal);
    case actions.MODAL_CLOSE:
      return state.delete('currentModal');
    default:
      return state;
  }
};
