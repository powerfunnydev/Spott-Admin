import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByListSelector,
  broadcastersEntitiesSelector,
  broadcastChannelsEntitiesSelector,
  broadcastChannelsListSelector,
  createEntityByIdSelector
} from '../../../../../selectors/data';

const isSelectedSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastChannels', 'isSelected' ]);
const pageCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastChannels', 'pageCount' ]);
const totalResultCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastChannels', 'totalResultCount' ]);

const currentBroadcasterIdSelector = (state, props) => props.params.broadcasterId;
const currentBroadcasterSelector = createEntityByIdSelector(broadcastersEntitiesSelector, currentBroadcasterIdSelector);
const broadcastChannelsSelector = createEntitiesByListSelector(broadcastChannelsListSelector, broadcastChannelsEntitiesSelector);

export default createStructuredSelector({
  broadcasterChannels: broadcastChannelsSelector,
  currentBroadcaster: currentBroadcasterSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
