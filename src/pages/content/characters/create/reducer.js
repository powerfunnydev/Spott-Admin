import { Map } from 'immutable';
import { PERSONS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case PERSONS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentPersonSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
