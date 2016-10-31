import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByListSelector,
  broadcastersEntitiesSelector,
  broadcastChannelsEntitiesSelector,
  broadcastChannelsListSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentBroadcasterIdSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastersEntryId' ]);

export const currentBroadcasterSelector = createEntityByIdSelector(broadcastersEntitiesSelector, currentBroadcasterIdSelector);

const broadcastChannelsSelector = createEntitiesByListSelector(broadcastChannelsListSelector, broadcastChannelsEntitiesSelector);

export default createStructuredSelector({
  broadcastChannels: broadcastChannelsSelector,
  currentBroadcaster: currentBroadcasterSelector
});
