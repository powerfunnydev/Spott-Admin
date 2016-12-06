import { createStructuredSelector } from 'reselect';
import {
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasSeriesEntriesRelationsSelector
} from '../../../../selectors/data';
import { currentLocaleSelector, localeNamesSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';

export const currentSeriesEntryIdSelector = createFormValueSelector('seasonCreate', 'seriesEntryId');
export const hasTitleSelector = createFormValueSelector('seasonCreate', 'hasTitle');

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'seasons', 'create', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  hasTitle: hasTitleSelector,
  localeNames: localeNamesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector
});
