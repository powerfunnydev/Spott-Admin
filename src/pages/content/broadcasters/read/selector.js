import { createStructuredSelector } from 'reselect';
import {
  broadcastersEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentBroadcasterIdSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'broadcastersEntryId' ]);

export const currentBroadcasterSelector = createEntityByIdSelector(broadcastersEntitiesSelector, currentBroadcasterIdSelector);

export default createStructuredSelector({
  currentBroadcaster: currentBroadcasterSelector
});
