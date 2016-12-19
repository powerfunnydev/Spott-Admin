import { Map } from 'immutable';
import * as actionTypes from '../constants/actionTypes';
import { ORGANIZE } from '../constants/mainTabTypes';

/**
  * The global reducer is responsible for storing global aspects of this application.
  *
  * global
  * -> activeTab: one of [ 'ORGANIZE', 'TAG' ]
  * -> authenticationToken
  * -> username
  */
export default (state = Map({ activeTab: ORGANIZE, tooltip: null }), action) => {
  switch (action.type) {
    case actionTypes.AUTHENTICATE:
      return state
        .set('authenticationToken', action.authenticationToken)
        .set('username', action.username);
    case actionTypes.MAIN_SELECT_TAB:
      return state.set('activeTab', action.tab);
    case actionTypes.SHOW_TOOLTIP:
      return state.set('tooltip', action.tooltip);
    case actionTypes.HIDE_TOOLTIP:
      return state.delete('tooltip');
    default:
      return state;
  }
};
