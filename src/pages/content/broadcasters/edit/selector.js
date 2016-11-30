import { createStructuredSelector } from 'reselect';
import { broadcastersEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentBroadcasterIdSelector = (state, props) => props.params.broadcasterId;
export const currentBroadcasterSelector = createEntityByIdSelector(broadcastersEntitiesSelector, currentBroadcasterIdSelector);

export default createStructuredSelector({
  currentBroadcaster: currentBroadcasterSelector
});
