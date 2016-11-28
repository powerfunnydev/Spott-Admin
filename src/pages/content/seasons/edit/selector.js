import { createSelector, createStructuredSelector } from 'reselect';
import {
  currentModalSelector
} from '../../../../selectors/global';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector,
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasSeriesEntriesRelationsSelector,
  seriesEntryHasSeasonsSelector
} from '../../../../selectors/data';
import { getFormValues } from 'redux-form/immutable';

const formName = 'seasonEdit';
const formSelector = getFormValues(formName);
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

export const currentSeriesEntryIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seriesEntryId')
);
export const currentDefaultLocaleSelector = createSelector(
  formSelector,
  (form) => (form && form.get('defaultLocale'))
);
export const _activeDefaultLocaleSelector = createSelector(
  formSelector,
  (form) => (form && form.get('_activeLocale'))
);
export const supportedLocalesSelector = createSelector(
  formSelector,
  (form) => (form && form.get('locales'))
);
export const hasTitleSelector = createSelector(
  formSelector,
  (form) => (form && form.get('hasTitle'))
);

export const currentSeasonIdSelector = (state, props) => { return props.params.seasonId; };
export const currentSeasonSelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeasonIdSelector);
export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  _activeLocale: _activeDefaultLocaleSelector,
  currentSeason: currentSeasonSelector,
  currentModal: currentModalSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  hasTitle: hasTitleSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
