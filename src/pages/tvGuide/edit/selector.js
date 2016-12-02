import { createSelector, createStructuredSelector } from 'reselect';
import { getFormValues } from 'redux-form/immutable';
import {
  tvGuideEntriesEntitiesSelector,
  broadcastChannelsEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  seasonHasEpisodesSelector,
  seriesEntryHasSeasonsSelector,
  listMediaEntitiesSelector,
  searchStringHasMediaRelationsSelector,
  searchStringHasBroadcastChannelsRelationsSelector
} from '../../../selectors/data';

const formSelector = getFormValues('tvGuideEditEntry');

export const currentTvGuideEntryIdSelector = (state, props) => props.params.tvGuideEntryId;
export const currentTvGuideEntrySelector = createEntityByIdSelector(tvGuideEntriesEntitiesSelector, currentTvGuideEntryIdSelector);

export const currentMediumIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('mediumId')
);
export const currentSeasonIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seasonId')
);

const currentMediumSelector = createEntityByIdSelector(listMediaEntitiesSelector, currentMediumIdSelector);

export const currentBroadcastChannelsSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'edit', 'currentBroadcastChannelsSearchString' ]);
export const currentEpisodesSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'edit', 'currentEpisodesSearchString' ]);
export const currentSeasonsSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'edit', 'currentSeasonsSearchString' ]);
export const currentMediaSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'edit', 'currentMediaSearchString' ]);

export const searchedEpisodeIdsSelector = createEntityIdsByRelationSelector(seasonHasEpisodesSelector, currentSeasonIdSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsSelector, currentMediumIdSelector);
export const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);
export const searchedBroadcastChannelIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastChannelsRelationsSelector, currentBroadcastChannelsSearchStringSelector);

export default createStructuredSelector({
  broadcastChannelsById: broadcastChannelsEntitiesSelector,
  currentTvGuideEntry: currentTvGuideEntrySelector,
  searchedBroadcastChannelIds: searchedBroadcastChannelIdsSelector,
  searchedEpisodeIds: searchedEpisodeIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedMediumIds: searchedMediumIdsSelector,
  medium: currentMediumSelector,
  mediaById: listMediaEntitiesSelector
});
