import { Map } from 'immutable';
import { ACTORS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case ACTORS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentActorSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
