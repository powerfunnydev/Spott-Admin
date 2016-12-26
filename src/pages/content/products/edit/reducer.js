import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, BRANDS_SEARCH_START } from './actions';
import { PRODUCT_PERSIST_SUCCESS } from '../../../../actions/product';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BRANDS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBrandSearchString', action.searchString);
    case PRODUCT_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The product is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
