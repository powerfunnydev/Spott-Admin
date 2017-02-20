import { createSelector, createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  filterHasCountriesRelationsSelector,
  filterHasLanguagesRelationsSelector,
  mediaEntitiesSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';
import { serializeFilterHasCountries, serializeFilterHasLanguages } from '../../../../reducers/utils';

const formName = 'seriesEntryEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };
const currentSeriesEntrySelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeriesEntryIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'series', 'edit', 'popUpMessage' ]);

// Audience
const currentAudienceCountriesSearchStringSelector = (state) => state.getIn([ 'content', 'series', 'edit', 'currentAudienceCountriesSearchString' ]);
const currentAudienceLanguagesSearchStringSelector = (state) => state.getIn([ 'content', 'series', 'edit', 'currentAudienceLanguagesSearchString' ]);

// Audience

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
  currentSeriesEntry: currentSeriesEntrySelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  searchedAudienceCountryIds: searchedAudienceCountryIdsSelector,
  searchedAudienceLanguageIds: searchedAudienceLanguageIdsSelector,
  supportedLocales: supportedLocalesSelector
});
