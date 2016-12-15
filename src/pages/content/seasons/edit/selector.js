import { createStructuredSelector } from 'reselect';
import {
  currentModalSelector
} from '../../../../selectors/global';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector,
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasSeriesEntriesRelationsSelector
} from '../../../../selectors/data';
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
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
