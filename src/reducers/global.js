import { Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes';

/**
  * The global reducer is responsible for storing global aspects of this application.
  *
  * global
  * -> authenticationToken
  * -> currentModal (e.g., 'login')
  */
// TODO: remove hardcoded authenticationToken!
export default (state = Map({}), action) => {
  switch (action.type) {
    case actionTypes.AUTHENTICATE:
      return state
        .set('authenticationToken', action.authenticationToken)
        .set('username', action.username);
    case actionTypes.MODAL_OPEN_LOGIN:
      return state.set('currentModal', 'login');
    case actionTypes.MODAL_CLOSE:
      return state.delete('currentModal');
    default:
      return state;
  }
};
