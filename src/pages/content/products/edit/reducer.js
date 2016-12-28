import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, BRANDS_SEARCH_START, PRODUCT_CATEGORIES_SEARCH_START, TAGS_SEARCH_START } from './actions';
import { PRODUCT_PERSIST_SUCCESS } from '../../../../actions/product';
import { SHOPS_SEARCH_START } from './productOfferings/persist/actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BRANDS_SEARCH_START:
      return state.set('currentBrandsSearchString', action.searchString);
    case PRODUCT_CATEGORIES_SEARCH_START:
      return state.set('currentProductCategoriesSearchString', action.searchString);
    case SHOPS_SEARCH_START:
      console.log('test');
      return state.set('currentShopsSearchString', action.searchString);
    case TAGS_SEARCH_START:
      return state.set('currentTagsSearchString', action.searchString);
    case PRODUCT_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The product is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
