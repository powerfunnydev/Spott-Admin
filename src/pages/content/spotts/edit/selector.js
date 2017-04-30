import { createSelector, createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import { serializeFilterHasCountries, serializeFilterHasLanguages } from '../../../../reducers/utils';
import {
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  filterHasCountriesRelationsSelector,
  filterHasLanguagesRelationsSelector,
  listBrandsEntitiesSelector,
  listCharactersEntitiesSelector,
  listPersonsEntitiesSelector,
  listProductsEntitiesSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasTopicsRelationsSelector,
  searchStringHasUsersRelationsSelector,
  spottsEntitiesSelector,
  topicsEntitiesSelector,
  usersEntitiesSelector
} from '../../../../selectors/data';

const formName = 'spottEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');
const spottTagsSelector = createSelector(
  createFormValueSelector(formName, 'tags'),
  (tags) => tags && typeof tags.toJS === 'function' ? tags.toJS() : tags
);
const topicIdsSelector = createSelector(
  createFormValueSelector(formName, 'topicIds'),
  (topicIds) => topicIds && typeof topicIds.toJS === 'function' ? topicIds.toJS() : topicIds
);
const promotedSelector = createFormValueSelector(formName, 'promoted');

const currentSpottIdSelector = (state, props) => props.params.spottId;
const currentSpottSelector = createEntityByIdSelector(spottsEntitiesSelector, currentSpottIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'popUpMessage' ]);

export const currentTopicsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentTopicsSearchString' ]);

export const searchedTopicIdsSelector = createEntityIdsByRelationSelector(searchStringHasTopicsRelationsSelector, currentTopicsSearchStringSelector);

export const currentUsersSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentUserSearchString' ]);

export const searchedUserIdsSelector = createEntityIdsByRelationSelector(searchStringHasUsersRelationsSelector, currentUsersSearchStringSelector);

// Audience

// Audience
const currentAudienceCountriesSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentAudienceCountriesSearchString' ]);
const currentAudienceLanguagesSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentAudienceLanguagesSearchString' ]);

export const audienceCountriesFilterKeySelector = createSelector(
  currentAudienceCountriesSearchStringSelector,
  (searchString) => serializeFilterHasCountries({ searchString })
);
export const audienceLanguagesFilterKeySelector = createSelector(
  currentAudienceLanguagesSearchStringSelector,
  (searchString) => serializeFilterHasLanguages({ searchString })
);

const searchedAudienceCountryIdsSelector = createEntityIdsByRelationSelector(filterHasCountriesRelationsSelector, audienceCountriesFilterKeySelector);
const searchedAudienceLanguageIdsSelector = createEntityIdsByRelationSelector(filterHasLanguagesRelationsSelector, audienceLanguagesFilterKeySelector);

const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentBrandsSearchString' ]);
const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  brandsById: listBrandsEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  currentModal: currentModalSelector,
  currentSpott: currentSpottSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  personsById: listPersonsEntitiesSelector,
  popUpMessage: popUpMessageSelector,
  productsById: listProductsEntitiesSelector,
  promoted: promotedSelector,
  searchedAudienceCountryIds: searchedAudienceCountryIdsSelector,
  searchedAudienceLanguageIds: searchedAudienceLanguageIdsSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedTopicIds: searchedTopicIdsSelector,
  supportedLocales: supportedLocalesSelector,
  tags: spottTagsSelector,
  topicIds: topicIdsSelector,
  topicsById: topicsEntitiesSelector,
  usersById: usersEntitiesSelector,
  searchedUserIds: searchedUserIdsSelector
});
