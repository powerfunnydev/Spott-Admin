import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByListSelector,
  broadcastersEntitiesSelector,
  broadcastChannelsEntitiesSelector,
  broadcastChannelsListSelector,
  createEntityByIdSelector
} from '../../../../../selectors/data';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastChannels', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastChannels', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastChannels', 'totalResultCount' ]);

export const currentBroadcasterIdSelector = (state, props) => { return props.params.id; };

export const currentBroadcasterSelector = createEntityByIdSelector(broadcastersEntitiesSelector, currentBroadcasterIdSelector);

const broadcastChannelsSelector = createEntitiesByListSelector(broadcastChannelsListSelector, broadcastChannelsEntitiesSelector);

export default createStructuredSelector({
  broadcastChannels: broadcastChannelsSelector,
  currentBroadcaster: currentBroadcasterSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
