import { createStructuredSelector } from 'reselect';
import {
  currentLocaleSelector,
  gendersSelector,
  localeNamesSelector
} from '../../../../selectors/global';
import { createEntityIdsByRelationSelector, searchStringHasTopicsRelationsSelector, topicsEntitiesSelector } from '../../../../selectors/data';

export const currentTopicsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'create', 'currentTopicsSearchString' ]);

export const searchedTopicIdsSelector = createEntityIdsByRelationSelector(searchStringHasTopicsRelationsSelector, currentTopicsSearchStringSelector);

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  genders: gendersSelector,
  localeNames: localeNamesSelector,
  topicsById: topicsEntitiesSelector,
  searchedTopicIds: searchedTopicIdsSelector
});
