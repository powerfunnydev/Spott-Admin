import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listSpottsEntitiesSelector, filterHasSpottsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasSpotts } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'spotts', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'spotts', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'spotts', 'list', 'totalResultCount' ]);

export const spottsFilterKeySelector = (state, props) => serializeFilterHasSpotts(props.location.query);

export const spottsSelector = createEntitiesByRelationSelector(
  filterHasSpottsRelationsSelector,
  spottsFilterKeySelector,
  listSpottsEntitiesSelector
);

export default createStructuredSelector({
  spotts: spottsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
