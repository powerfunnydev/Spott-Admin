import { createStructuredSelector } from 'reselect';
import { broadcastChannelsEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentBroadcastChannelIdSelector = (state, props) => props.params.id;
export const currentBroadcastChannelSelector = createEntityByIdSelector(broadcastChannelsEntitiesSelector, currentBroadcastChannelIdSelector);

export default createStructuredSelector({
  currentBroadcastChannel: currentBroadcastChannelSelector
});
