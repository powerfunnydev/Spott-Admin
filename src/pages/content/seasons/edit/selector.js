import { createSelector, createStructuredSelector } from 'reselect';
import {
  currentModalSelector
} from '../../../../selectors/global';
import {
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  filterHasCountriesRelationsSelector,
  filterHasLanguagesRelationsSelector,
  listMediaEntitiesSelector,
  mediaEntitiesSelector,
  searchStringHasSeriesEntriesRelationsSelector
} from '../../../../selectors/data';
import { serializeFilterHasCountries, serializeFilterHasLanguages } from '../../../../reducers/utils';
import { createFormValueSelector } from '../../../../utils';

const formName = 'seasonEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

// !!! selector of the addLanguage form !!!
const addLanguageHasTitleSelector = createFormValueSelector('addLanguage', 'hasTitle');

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const currentSeriesEntryIdSelector = createFormValueSelector(formName, 'seriesEntryId');
const hasTitleSelector = createFormValueSelector(formName, 'hasTitle');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentSeasonIdSelector = (state, props) => { return props.params.seasonId; };
const currentSeasonSelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeasonIdSelector);
const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);
const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'seasons', 'edit', 'popUpMessage' ]);

// Audience
const currentAudienceCountriesSearchStringSelector = (state) => state.getIn([ 'content', 'seasons', 'edit', 'currentAudienceCountriesSearchString' ]);
const currentAudienceLanguagesSearchStringSelector = (state) => state.getIn([ 'content', 'seasons', 'edit', 'currentAudienceLanguagesSearchString' ]);

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
  addLanguageHasTitle: addLanguageHasTitleSelector,
  currentSeason: currentSeasonSelector,
  currentModal: currentModalSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  hasTitle: hasTitleSelector,
  popUpMessage: popUpMessageSelector,
  searchedAudienceCountryIds: searchedAudienceCountryIdsSelector,
  searchedAudienceLanguageIds: searchedAudienceLanguageIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
