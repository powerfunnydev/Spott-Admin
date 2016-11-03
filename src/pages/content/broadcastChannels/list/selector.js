import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, broadcastChannelsEntitiesSelector, filterHasBroadcasterChannelsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasBroadcastChannels } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'broadcastChannels', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'broadcastChannels', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'broadcastChannels', 'list', 'totalResultCount' ]);

export const broadcastChannelsFilterKeySelector = (state, props) => { return serializeFilterHasBroadcastChannels(props.location.query); };

export const broadcastChannelsSelector = createEntitiesByRelationSelector(
  filterHasBroadcasterChannelsRelationsSelector,
  broadcastChannelsFilterKeySelector,
  broadcastChannelsEntitiesSelector
);

export default createStructuredSelector({
  broadcastChannels: broadcastChannelsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
