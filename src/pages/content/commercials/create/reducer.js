import { Map } from 'immutable';
import { BRANDS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentBrandsSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
