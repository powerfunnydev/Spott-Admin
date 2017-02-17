import { Map } from 'immutable';
import { PERSONS_SEARCH_START, CLOSE_POP_UP_MESSAGE } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case PERSONS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentPersonSearchString', action.searchString);
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
