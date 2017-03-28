import { Map } from 'immutable';
import { TOPICS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case TOPICS_SEARCH_START:
      return state.set('currentTopicsSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
