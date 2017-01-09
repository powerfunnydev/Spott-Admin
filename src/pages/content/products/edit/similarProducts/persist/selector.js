import { createStructuredSelector } from 'reselect';
import { currenciesSelector, localeNamesSelector } from '../../../../../../selectors/global';
import {
  listProductsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasProductsRelationsSelector
} from '../../../../../../selectors/data';

export const currentProductsSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'currentProductsSearchString' ]);

export const searchedProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentProductsSearchStringSelector);

export default createStructuredSelector({
  productsById: listProductsEntitiesSelector,
  searchedProductIds: searchedProductIdsSelector,
  currencies: currenciesSelector,
  localeNames: localeNamesSelector
});
