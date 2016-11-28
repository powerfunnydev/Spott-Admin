import { createStructuredSelector, createSelector } from 'reselect';
import { getFormValues } from 'redux-form/immutable';
import {
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasSeriesEntriesRelationsSelector
} from '../../../../selectors/data';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';

const formSelector = getFormValues('seasonsCreateEntry');

export const currentSeriesEntryIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seriesEntryId')
);

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'seasons', 'create', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector
});
