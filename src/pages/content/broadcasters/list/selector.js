import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, broadcastersEntitiesSelector, filterHasBroadcastersRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasBroadcasters } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'broadcasters', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'list', 'totalResultCount' ]);

export const broadcastersFilterKeySelector = (state, props) => { return serializeFilterHasBroadcasters(props.location.query); };

export const broadcastersSelector = createEntitiesByRelationSelector(
  filterHasBroadcastersRelationsSelector,
  broadcastersFilterKeySelector,
  broadcastersEntitiesSelector
);

export default createStructuredSelector({
  broadcasters: broadcastersSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
