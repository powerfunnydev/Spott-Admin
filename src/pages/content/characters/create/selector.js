import { createStructuredSelector } from 'reselect';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';
import {
  personsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasPersonsRelationsSelector
} from '../../../../selectors/data';

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'characters', 'create', 'currentPersonSearchString' ]);

export const searchedPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  personsById: personsEntitiesSelector,
  searchedPersonIds: searchedPersonIdsSelector,
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
