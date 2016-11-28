import { createStructuredSelector } from 'reselect';
import {
  broadcastersEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBroadcastersRelationsSelector
} from '../../../../selectors/data';

const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'broadcastChannels', 'create', 'currentBroadcasterSearchString' ]);
const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);

export default createStructuredSelector({
  broadcastersById: broadcastersEntitiesSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector
});
