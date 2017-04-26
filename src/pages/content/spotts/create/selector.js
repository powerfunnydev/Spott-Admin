import { createSelector, createStructuredSelector } from 'reselect';
import {
  currentLocaleSelector,
  gendersSelector,
  localeNamesSelector
} from '../../../../selectors/global';
import {
  createEntityIdsByRelationSelector,
  listCharactersEntitiesSelector,
  listPersonsEntitiesSelector,
  listProductsEntitiesSelector,
  searchStringHasTopicsRelationsSelector,
  topicsEntitiesSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'spottCreate';

// topicIds
const topicIdsSelector = createSelector(
  createFormValueSelector(formName, 'topicIds'),
  (topicIds) => topicIds && typeof topicIds.toJS === 'function' ? topicIds.toJS() : topicIds
);

// Image
const imageSelector = createSelector(
  createFormValueSelector(formName, 'image'),
  (image) => image && typeof image.toJS === 'function' ? image.toJS() : image
);

// Tags
const spottTagsSelector = createSelector(
  createFormValueSelector(formName, 'tags'),
  (tags) => tags && typeof tags.toJS === 'function' ? tags.toJS() : tags
);

export const currentTopicsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'create', 'currentTopicsSearchString' ]);

export const searchedTopicIdsSelector = createEntityIdsByRelationSelector(searchStringHasTopicsRelationsSelector, currentTopicsSearchStringSelector);

export default createStructuredSelector({
  charactersById: listCharactersEntitiesSelector,
  currentLocale: currentLocaleSelector,
  genders: gendersSelector,
  image: imageSelector,
  localeNames: localeNamesSelector,
  personsById: listPersonsEntitiesSelector,
  productsById: listProductsEntitiesSelector,
  tags: spottTagsSelector,
  topicIds: topicIdsSelector,
  topicsById: topicsEntitiesSelector,
  searchedTopicIds: searchedTopicIdsSelector
});
