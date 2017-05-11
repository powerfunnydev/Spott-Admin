import { createSelector, createStructuredSelector } from 'reselect';
import { getFormValues } from 'redux-form/immutable';
import {
  createEntityIdsByRelationSelector,
  seasonHasEpisodesRelationsSelector,
  seriesEntryHasSeasonsRelationsSelector,
  listMediaEntitiesSelector
} from '../../../../selectors/data';

const formSelector = getFormValues('collectionImport');

export const currentSeriesIdSelector = (state, props) => props.currentSeriesEntryId;

export const currentSeasonIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seasonId')
);

export const currentEpisodesSearchStringSelector = (state) => state.getIn([ 'episodes', 'edit', 'currentEpisodesSearchString' ]);
export const currentSeasonsSearchStringSelector = (state) => state.getIn([ 'episodes', 'edit', 'currentSeasonsSearchString' ]);

export const searchedEpisodeIdsSelector = createEntityIdsByRelationSelector(seasonHasEpisodesRelationsSelector, currentSeasonIdSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsRelationsSelector, currentSeriesIdSelector);

export default createStructuredSelector({
  mediaById: listMediaEntitiesSelector,
  searchedEpisodeIds: searchedEpisodeIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  currentSeriesId: currentSeriesIdSelector
});
