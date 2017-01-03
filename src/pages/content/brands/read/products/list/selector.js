import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listProductsEntitiesSelector, filterHasProductsRelationsSelector } from '../../../../../../selectors/data';
import { serializeFilterHasProducts } from '../../../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'brands', 'read', 'products', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'brands', 'read', 'products', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'brands', 'read', 'products', 'totalResultCount' ]);

// second argument of serializeFilterHasProducts is a unique key, specific for this table.
// general products <-> products of content producer
export const productsFilterKeySelector = (state, props) => { return serializeFilterHasProducts(getInformationFromQuery(props.location.query, prefix), 'brands'); };

export const productsSelector = createEntitiesByRelationSelector(
  filterHasProductsRelationsSelector,
  productsFilterKeySelector,
  listProductsEntitiesSelector
);

export default createStructuredSelector({
  products: productsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
