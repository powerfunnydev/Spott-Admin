import { createSelector, createStructuredSelector } from 'reselect';
import { getFormValues } from 'redux-form/immutable';
import {
  broadcastChannelsEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  filterHasEpisodesRelationsSelector,
  filterHasSeasonsRelationsSelector,
  listMediaEntitiesSelector,
  searchStringHasMediaRelationsSelector,
  searchStringHasBroadcastChannelsRelationsSelector
} from '../../../selectors/data';
import { serializeFilterHasEpisodes, serializeFilterHasSeries } from '../../../reducers/utils';

const formSelector = getFormValues('tvGuideCreateEntry');

export const currentMediumIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('mediumId')
);
export const currentSeasonIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seasonId')
);

const currentMediumSelector = createEntityByIdSelector(listMediaEntitiesSelector, currentMediumIdSelector);

export const currentBroadcastChannelsSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'create', 'currentBroadcastChannelsSearchString' ]);
export const currentEpisodesSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'create', 'currentEpisodesSearchString' ]);
export const currentSeasonsSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'create', 'currentSeasonsSearchString' ]);
export const currentMediaSearchStringSelector = (state) => state.getIn([ 'tvGuide', 'create', 'currentMediaSearchString' ]);
// export const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'editEpisodes', 'currentContentProducersSearchString' ]);
// export const currentSeriesFilterHasSeasonsStringSelector = createSelector(
//   currentseriesEntryIdSelector,
//   currentSeasonsSearchStringSelector,
//   (seriesEntryId, searchString) => `searchString=${encodeURIComponent(searchString || '')}&seriesEntryId=${seriesEntryId || ''}`

// );

const currentEpisodesFilterSelector = createSelector(
  currentEpisodesSearchStringSelector,
  currentSeasonIdSelector,
  (searchString, seasonId) => serializeFilterHasEpisodes({ searchString, seasonId })
);
const currentSeasonsFilterSelector = createSelector(
  currentSeasonsSearchStringSelector,
  currentMediumIdSelector,
  (searchString, seriesEntryId) => serializeFilterHasSeries({ searchString, seriesEntryId })
);
export const searchedEpisodeIdsSelector = createEntityIdsByRelationSelector(filterHasEpisodesRelationsSelector, currentEpisodesFilterSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(filterHasSeasonsRelationsSelector, currentSeasonsFilterSelector);
export const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);
export const searchedBroadcastChannelIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastChannelsRelationsSelector, currentBroadcastChannelsSearchStringSelector);

export default createStructuredSelector({
  broadcastChannelsById: broadcastChannelsEntitiesSelector,
  searchedBroadcastChannelIds: searchedBroadcastChannelIdsSelector,
  searchedEpisodeIds: searchedEpisodeIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedMediumIds: searchedMediumIdsSelector,
  medium: currentMediumSelector,
  mediaById: listMediaEntitiesSelector
});
