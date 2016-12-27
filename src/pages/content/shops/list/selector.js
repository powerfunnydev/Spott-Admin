import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listShopsEntitiesSelector, filterHasShopsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasShops } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'shops', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'shops', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'shops', 'list', 'totalResultCount' ]);

export const shopsFilterKeySelector = (state, props) => serializeFilterHasShops(props.location.query);

export const shopsSelector = createEntitiesByRelationSelector(
  filterHasShopsRelationsSelector,
  shopsFilterKeySelector,
  listShopsEntitiesSelector
);

export default createStructuredSelector({
  shops: shopsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
