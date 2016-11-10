import { createStructuredSelector } from 'reselect';
import {
  broadcastersEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentBroadcasterIdSelector = (state, props) => { return props.params.id; };

export const currentBroadcasterSelector = createEntityByIdSelector(broadcastersEntitiesSelector, currentBroadcasterIdSelector);

export default createStructuredSelector({
  currentBroadcaster: currentBroadcasterSelector
});
