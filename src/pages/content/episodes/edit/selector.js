import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  createEntitiesByRelationSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  listBrandsEntitiesSelector,
  listCharactersEntitiesSelector,
  listMediaEntitiesSelector,
  listMediumCategoriesEntitiesSelector,
  listShopsEntitiesSelector,
  mediaEntitiesSelector,
  mediumHasBrandsRelationsSelector,
  mediumHasCharactersRelationsSelector,
  mediumHasShopsRelationsSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  searchStringHasMediumCategoriesRelationsSelector,
  searchStringHasSeriesEntriesRelationsSelector,
  searchStringHasShopsRelationsSelector,
  seriesEntryHasSeasonsRelationsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'episodeEdit';
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);

// !!! selector of the addLanguage form !!!
const addLanguageHasTitleSelector = createFormValueSelector('addLanguage', 'hasTitle');

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const currentSeasonIdSelector = createFormValueSelector(formName, 'seasonId');
const currentSeriesEntryIdSelector = createFormValueSelector(formName, 'seriesEntryId');
const hasTitleSelector = createFormValueSelector(formName, 'hasTitle');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };
const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);

const currentBrandSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentBrandSearchString' ]);
const currentCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCharacterSearchString' ]);
const currentShopSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentShopSearchString' ]);
const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentBroadcastersSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentMediumCategoriesSearchString' ]);
const popUpMessageSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'popUpMessage' ]);

const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandSearchStringSelector);
const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharacterSearchStringSelector);
const searchedShopIdsSelector = createEntityIdsByRelationSelector(searchStringHasShopsRelationsSelector, currentShopSearchStringSelector);
const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsRelationsSelector, currentSeriesEntryIdSelector);
const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);

const episodeBrandsSelector = createEntitiesByRelationSelector(mediumHasBrandsRelationsSelector, currentEpisodeIdSelector, listBrandsEntitiesSelector);
const episodeCharactersSelector = createEntitiesByRelationSelector(mediumHasCharactersRelationsSelector, currentEpisodeIdSelector, listCharactersEntitiesSelector);
const episodeShopsSelector = createEntitiesByRelationSelector(mediumHasShopsRelationsSelector, currentEpisodeIdSelector, listShopsEntitiesSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  addLanguageHasTitle: addLanguageHasTitleSelector,
  brandsById: listBrandsEntitiesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentEpisode: currentEpisodeSelector,
  currentModal: currentModalSelector,
  currentSeasonId: currentSeasonIdSelector,
  currentSeriesEntryId: currentSeriesEntryIdSelector,
  defaultLocale: currentDefaultLocaleSelector,
  episodeBrands: episodeBrandsSelector,
  episodeCharacters: episodeCharactersSelector,
  episodeShops: episodeShopsSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  hasTitle: hasTitleSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  popUpMessage: popUpMessageSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedMediumCategoryIds: searchedMediumCategoryIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  searchedShopIds: searchedShopIdsSelector,
  seasonsById: listMediaEntitiesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  shopsById: listShopsEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
