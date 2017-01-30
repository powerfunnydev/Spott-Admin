import { Map } from 'immutable';
import * as actions from '../components/sidebar/collectionTab/list/actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.COLLECTIONS_BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentCollectionsBrandSearchString', action.searchString);
    case actions.COLLECTIONS_CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCollectionsCharacterSearchString', action.searchString);
    case actions.COLLECTIONS_PRODUCTS_SEARCH_START: // Autocompletion field of products
      return state.set('currentCollectionsProductSearchString', action.searchString);
    default:
      return state;
  }
};
