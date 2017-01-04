import { createStructuredSelector } from 'reselect';
import { currenciesSelector } from '../../../../selectors/global';
import { createEntitiesByRelationSelector, listProductsEntitiesSelector, filterHasProductsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasProducts } from '../../../../reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { filterArray, prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'products', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'products', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'products', 'list', 'totalResultCount' ]);

export const productsFilterKeySelector = (state, props) => serializeFilterHasProducts(getInformationFromQuery(props.location.query, prefix, filterArray));

export const productsSelector = createEntitiesByRelationSelector(
  filterHasProductsRelationsSelector,
  productsFilterKeySelector,
  listProductsEntitiesSelector
);

export default createStructuredSelector({
  productsFilterKey: productsFilterKeySelector,
  currencies: currenciesSelector,
  products: productsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
