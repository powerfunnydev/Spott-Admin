import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector,
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  searchStringHasSeriesEntriesRelationsSelector,
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  seriesEntryHasSeasonsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'episodeEdit';
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);

const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const availabilitiesSelector = createFormValueSelector(formName, 'availabilities');
const charactersSelector = createFormValueSelector(formName, 'characters');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const currentSeasonIdSelector = createFormValueSelector(formName, 'seasonId');
const currentSeriesEntryIdSelector = createFormValueSelector(formName, 'seriesEntryId');
const hasTitleSelector = createFormValueSelector(formName, 'hasTitle');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };
const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);
const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);

const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsSelector, currentSeriesEntryIdSelector);

export const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentBroadcastersSearchString' ]);
export const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentContentProducersSearchString' ]);

export const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
export const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  availabilities: availabilitiesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  characters: charactersSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentEpisode: currentEpisodeSelector,
  currentModal: currentModalSelector,
  currentSeasonId: currentSeasonIdSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  hasTitle: hasTitleSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seasonsById: listMediaEntitiesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});