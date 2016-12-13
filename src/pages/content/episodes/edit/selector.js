import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  listCharactersEntitiesSelector,
  mediaEntitiesSelector,
  createEntityByIdSelector,
  listMediaEntitiesSelector,
  createEntityIdsByRelationSelector,
  listMediumCategoriesEntitiesSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  searchStringHasSeriesEntriesRelationsSelector,
  searchStringHasMediumCategoriesRelationsSelector,
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  seriesEntryHasSeasonsRelationsSelector,
  mediumHasCharactersRelationsSelector,
  createEntitiesByRelationSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'episodeEdit';
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);

const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const currentSeasonIdSelector = createFormValueSelector(formName, 'seasonId');
const currentSeriesEntryIdSelector = createFormValueSelector(formName, 'seriesEntryId');
const hasTitleSelector = createFormValueSelector(formName, 'hasTitle');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };
const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);

const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCharacterSearchString' ]);
const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentBroadcastersSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentMediumCategoriesSearchString' ]);

const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsRelationsSelector, currentSeriesEntryIdSelector);
const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);

const episodeCharactersSelector = createEntitiesByRelationSelector(mediumHasCharactersRelationsSelector, currentEpisodeIdSelector, listCharactersEntitiesSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  broadcastersById: broadcastersEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentEpisode: currentEpisodeSelector,
  currentModal: currentModalSelector,
  currentSeasonId: currentSeasonIdSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  episodeCharacters: episodeCharactersSelector,
  errors: formErrorsSelector,
  hasTitle: hasTitleSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedMediumCategoryIds: searchedMediumCategoryIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seasonsById: listMediaEntitiesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
