import { Map } from 'immutable';
import { BRANDS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BRANDS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBrandSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
