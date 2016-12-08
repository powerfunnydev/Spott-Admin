import { Map } from 'immutable';
import { USERS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case USERS_SEARCH_START: // Autocompletion field of broadcast channel
      return state.set('currentUserSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;

  }
};
