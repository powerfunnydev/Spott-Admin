import { createStructuredSelector } from 'reselect';
import {
  listProductsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasProductsRelationsSelector,
  similarProductsEntitiesSelector,
  createEntitiesByRelationSelector,
  productHasSimilarProductsRelationsSelector
} from '../../../../../../selectors/data';
import { currenciesSelector } from '../../../../../../selectors/global';

export const currentProductsSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'currentProductsSearchString' ]);

export const searchedProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentProductsSearchStringSelector);

const currentProductIdSelector = (state, props) => props.productId;

const similarProductsSelector = createEntitiesByRelationSelector(
  productHasSimilarProductsRelationsSelector,
  currentProductIdSelector,
  similarProductsEntitiesSelector
);
export default createStructuredSelector({
  currencies: currenciesSelector,
  similarProducts: similarProductsSelector,
  productsById: listProductsEntitiesSelector,
  searchedProductIds: searchedProductIdsSelector
});
