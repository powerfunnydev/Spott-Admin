import { Map } from 'immutable';
import { BROADCASTERS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BROADCASTERS_SEARCH_START: // Autocompletion field of broadcast channel
      return state.set('currentBroadcasterSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;

  }
};
