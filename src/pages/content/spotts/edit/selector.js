import { createSelector, createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import { serializeFilterHasCountries, serializeFilterHasLanguages } from '../../../../reducers/utils';
import {
  createEntityIdsByRelationSelector,
  createEntityByIdSelector,
  filterHasCountriesRelationsSelector,
  filterHasLanguagesRelationsSelector,
  searchStringHasTopicsRelationsSelector,
  spottsEntitiesSelector,
  topicsEntitiesSelector,
  listCharactersEntitiesSelector,
  listPersonsEntitiesSelector,
  listProductsEntitiesSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasPersonsRelationsSelector,
  searchStringHasProductsRelationsSelector
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

const currentSpottIdSelector = (state, props) => props.params.spottId;
const currentSpottSelector = createEntityByIdSelector(spottsEntitiesSelector, currentSpottIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'popUpMessage' ]);

export const currentTopicsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentTopicsSearchString' ]);

export const searchedTopicIdsSelector = createEntityIdsByRelationSelector(searchStringHasTopicsRelationsSelector, currentTopicsSearchStringSelector);

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

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  charactersById: listCharactersEntitiesSelector,
  currentModal: currentModalSelector,
  currentSpott: currentSpottSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  personsById: listPersonsEntitiesSelector,
  popUpMessage: popUpMessageSelector,
  productsById: listProductsEntitiesSelector,
  searchedAudienceCountryIds: searchedAudienceCountryIdsSelector,
  searchedAudienceLanguageIds: searchedAudienceLanguageIdsSelector,
  searchedTopicIds: searchedTopicIdsSelector,
  supportedLocales: supportedLocalesSelector,
  tags: spottTagsSelector,
  topicIds: topicIdsSelector,
  topicsById: topicsEntitiesSelector
});

export const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentTagsCharactersSearchString' ]);
export const currentPersonsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentTagsPersonsSearchString' ]);
export const currentProductsSearchStringSelector = (state) => state.getIn([ 'content', 'spotts', 'edit', 'currentTagsProductsSearchString' ]);

export const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
export const searchedPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentPersonsSearchStringSelector);
export const searchedProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentProductsSearchStringSelector);

const entityTypeSelector = createFormValueSelector('tagCreate', 'entityType');

const productCharactersSelector = createSelector(
  spottTagsSelector,
  listCharactersEntitiesSelector,
  listPersonsEntitiesSelector,
  (tags, charactersById, personsById) => {
    const characters = [];
    for (const tag of tags) {
      if (tag.entityType === 'CHARACTER') {
        const character = charactersById.get(tag.characterId);
        if (character) {
          characters.push({
            entityType: 'CHARACTER',
            id: character.get('id'),
            imageUrl: character.getIn([ 'portraitImage', 'url' ]),
            name: character.get('name')
          });
        }
      } else if (tag.entityType === 'PERSON') {
        const person = personsById.get(tag.personId);
        if (person) {
          characters.push({
            entityType: 'PERSON',
            id: person.get('id'),
            imageUrl: person.getIn([ 'portraitImage', 'url' ]),
            name: person.get('fullName')
          });
        }
      }
    }
    return characters;
  }
);

export const tagsSelector = createStructuredSelector({
  charactersById: listCharactersEntitiesSelector,
  entityType: entityTypeSelector,
  personsById: listPersonsEntitiesSelector,
  productsById: listProductsEntitiesSelector,
  productCharacters: productCharactersSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedPersonIds: searchedPersonIdsSelector,
  searchedProductIds: searchedProductIdsSelector
});
