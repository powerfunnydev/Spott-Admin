import { createSelector, createStructuredSelector } from 'reselect';
import {
  broadcastChannelsEntitiesSelector,
  broadcastersEntitiesSelector,
  createEntityIdsByRelationSelector,
  filterHasBroadcasterChannelsRelationsSelector,
  filterHasMediaRelationsSelector,
  listMediaEntitiesSelector,
  searchStringHasBroadcastersRelationsSelector
} from '../../../../../../selectors/data';
import { createFormValueSelector } from '../../../../../../utils';
import { serializeFilterHasBroadcastChannels, serializeBroadcasterFilterHasMedia } from '../../../../../../reducers/utils';

const noEndDateSelector = createFormValueSelector('scheduleEntry', 'noEndDate');
export const broadcasterIdSelector = createFormValueSelector('scheduleEntry', 'broadcasterId');

const currentBroadcasterChannelsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'schedule', 'currentBroadcasterChannelsSearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'schedule', 'currentBroadcastersSearchString' ]);
const currentBroadcasterMediaSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'schedule', 'currentBroadcasterMediaSearchString' ]);

export const broadcasterMediaFilterKeySelector = createSelector(
  broadcasterIdSelector,
  currentBroadcasterMediaSearchStringSelector,
  (broadcasterId, searchString) => serializeBroadcasterFilterHasMedia({ broadcasterId, searchString })
);

export const broadcasterChannelsFilterKeySelector = createSelector(
  broadcasterIdSelector,
  currentBroadcasterChannelsSearchStringSelector,
  (broadcasterId, searchString) => serializeFilterHasBroadcastChannels({ broadcasterId, searchString })
);

const searchedBroadcasterChannelIdsSelector = createEntityIdsByRelationSelector(filterHasBroadcasterChannelsRelationsSelector, broadcasterChannelsFilterKeySelector);
const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedBroadcasterMediumIdsSelector = createEntityIdsByRelationSelector(filterHasMediaRelationsSelector, broadcasterMediaFilterKeySelector);

export default createStructuredSelector({
  broadcastChannelsById: broadcastChannelsEntitiesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  broadcasterId: broadcasterIdSelector,
  mediaById: listMediaEntitiesSelector,
  noEndDate: noEndDateSelector,
  searchedBroadcasterChannelIds: searchedBroadcasterChannelIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedBroadcasterMediumIds: searchedBroadcasterMediumIdsSelector
});
