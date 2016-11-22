import { createSelector, createStructuredSelector } from 'reselect';
import { getFormValues } from 'redux-form/immutable';
import {
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasSeriesEntriesRelationsSelector,
  seriesEntryHasSeasonsSelector
} from '../../../../selectors/data';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';

const formSelector = getFormValues('episodesCreateEntry');

export const currentSeriesEntryIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seriesEntryId')
);
export const currentSeasonIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seasonId')
);
export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'create', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  seasonsById: listMediaEntitiesSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  currentSeasonId: currentSeasonIdSelector
});
