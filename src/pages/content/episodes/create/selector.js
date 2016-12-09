import { createStructuredSelector } from 'reselect';
import {
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasSeriesEntriesRelationsSelector,
  seriesEntryHasSeasonsRelationsSelector
} from '../../../../selectors/data';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';

const formName = 'episodeCreate';
export const currentSeriesEntryIdSelector = createFormValueSelector(formName, 'seriesEntryId');
export const currentSeasonIdSelector = createFormValueSelector(formName, 'seasonId');
export const hasTitleSelector = createFormValueSelector(formName, 'hasTitle');

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'create', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsRelationsSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  hasTitle: hasTitleSelector,
  localeNames: localeNamesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  seasonsById: listMediaEntitiesSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  currentSeasonId: currentSeasonIdSelector
});
