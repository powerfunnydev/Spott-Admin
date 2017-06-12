import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, BRANDS_SEARCH_START, DATALABELS_SEARCH_START } from './actions';
import { PRODUCT_PERSIST_SUCCESS } from '../../../../actions/product';
import { SHOPS_SEARCH_START } from './productOfferings/persist/actions';
import { PRODUCTS_SEARCH_START } from './similarProducts/list/actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    // used by similarProducts
    case PRODUCTS_SEARCH_START:
      return state.set('currentProductsSearchString', action.searchString);
    case BRANDS_SEARCH_START:
      return state.set('currentBrandsSearchString', action.searchString);
    case DATALABELS_SEARCH_START:
      return state.set('currentProductLabelsSearchString', action.searchString);
    case SHOPS_SEARCH_START:
      return state.set('currentShopsSearchString', action.searchString);
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
