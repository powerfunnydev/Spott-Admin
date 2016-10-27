import { createStructuredSelector } from 'reselect';
import {
  broadcastersEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBroadcastersRelationsSelector
} from '../../../../selectors/data';

export const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'broadcastChannels', 'create', 'currentBroadcasterSearchString' ]);

export const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);

export default createStructuredSelector({
  broadcastersById: broadcastersEntitiesSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector
});
