import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listBrandsEntitiesSelector, filterHasBrandsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasBrands } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'brands', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'brands', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'brands', 'list', 'totalResultCount' ]);

export const brandsFilterKeySelector = (state, props) => serializeFilterHasBrands(props.location.query);

export const brandsSelector = createEntitiesByRelationSelector(
  filterHasBrandsRelationsSelector,
  brandsFilterKeySelector,
  listBrandsEntitiesSelector
);

export default createStructuredSelector({
  brands: brandsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
