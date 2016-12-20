import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listMediaEntitiesSelector, filterHasCommercialsRelationsSelector } from '../../../../selectors/data';
import { serialize } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'totalResultCount' ]);

export const commercialsFilterKeySelector = (state, props) => { return serialize(props.location.query); };

export const commercialsSelector = createEntitiesByRelationSelector(
  filterHasCommercialsRelationsSelector,
  commercialsFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  commercials: commercialsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
