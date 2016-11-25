import { createSelector, createStructuredSelector } from 'reselect';
import {
  localeNamesSelector,
  currentLocaleSelector
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

const formSelector = getFormValues('episodeEdit');

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
export const copyFromBaseSelector = createSelector(
  formSelector,
  (form) => (form && form.get('copyFromBase'))
);

export const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };
export const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);
export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);

export const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
export const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  _activeLocale: _activeDefaultLocaleSelector,
  copyFromBase: copyFromBaseSelector,
  currentEpisode: currentEpisodeSelector,
  currentLocale: currentLocaleSelector,
  currentSeasonId: currentSeasonIdSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  localeNames: localeNamesSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seasonsById: listMediaEntitiesSelector,
  seriesEntriesById: listMediaEntitiesSelector
});
