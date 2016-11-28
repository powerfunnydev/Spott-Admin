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

const formName = 'episodeEdit';
const formSelector = getFormValues(formName);
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

export const currentSeriesEntryIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seriesEntryId')
);
export const currentSeasonIdSelector = createSelector(
  formSelector,
  (form) => form && form.get('seasonId')
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
export const availabilitiesSelector = createSelector(
  formSelector,
  (form) => (form && form.get('availabilities'))
);

export const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };
export const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);
export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  _activeLocale: _activeDefaultLocaleSelector,
  availabilities: availabilitiesSelector,
  currentEpisode: currentEpisodeSelector,
  currentModal: currentModalSelector,
  currentSeasonId: currentSeasonIdSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  hasTitle: hasTitleSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seasonsById: listMediaEntitiesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
