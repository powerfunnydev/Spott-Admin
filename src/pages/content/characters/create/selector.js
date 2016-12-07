import { createStructuredSelector } from 'reselect';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';
import {
  actorsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasActorsRelationsSelector
} from '../../../../selectors/data';

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'characters', 'create', 'currentActorSearchString' ]);

export const searchedActorIdsSelector = createEntityIdsByRelationSelector(searchStringHasActorsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  actorsById: actorsEntitiesSelector,
  searchedActorIds: searchedActorIdsSelector,
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
