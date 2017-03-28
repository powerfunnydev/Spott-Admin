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
  topicsEntitiesSelector
} from '../../../../selectors/data';

const formName = 'spottEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentSpottIdSelector = (state, props) => props.params.spottId;
const currentSpottSelector = createEntityByIdSelector(spottsEntitiesSelector, currentSpottIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'brands', 'edit', 'popUpMessage' ]);

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
  currentModal: currentModalSelector,
  currentSpott: currentSpottSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  searchedAudienceCountryIds: searchedAudienceCountryIdsSelector,
  searchedAudienceLanguageIds: searchedAudienceLanguageIdsSelector,
  searchedTopicIds: searchedTopicIdsSelector,
  supportedLocales: supportedLocalesSelector,
  topicsById: topicsEntitiesSelector
});
