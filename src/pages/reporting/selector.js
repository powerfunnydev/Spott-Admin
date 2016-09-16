import { createStructuredSelector } from 'reselect';
import {
  createEntityIdsByRelationSelector,
  searchStringHasSeriesRelationsSelector,
  seriesEntitiesSelector
} from '../../selectors/data';

export const currentSeriesSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentSeriesSearchString' ]);

export const searchedSeriesIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesRelationsSelector, currentSeriesSearchStringSelector);

export const mediaFilterSelector = createStructuredSelector({
  searchedSeriesIds: searchedSeriesIdsSelector,
  seriesById: seriesEntitiesSelector
});

export const eventsFilterSelector = createStructuredSelector({
  eventsById: seriesEntitiesSelector,
  searchedEventIds: searchedSeriesIdsSelector
});
