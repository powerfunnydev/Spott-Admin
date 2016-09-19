import { createStructuredSelector } from 'reselect';
import {
  createEntityIdsByRelationSelector,
  searchStringHasMediaRelationsSelector,
  mediaEntitiesSelector
} from '../../selectors/data';

export const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);

export const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);

export const mediaFilterSelector = createStructuredSelector({
  mediaById: mediaEntitiesSelector,
  searchedMediumIds: searchedMediumIdsSelector
});

export const eventsFilterSelector = createStructuredSelector({
  eventsById: mediaEntitiesSelector,
  searchedEventIds: searchedMediumIdsSelector
});

export const filterSelector = createStructuredSelector({
  searchedMediumIds: searchedMediumIdsSelector,
  seriesById: mediaEntitiesSelector
});
