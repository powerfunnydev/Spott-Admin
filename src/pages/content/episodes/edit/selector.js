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
  listCollectionsEntitiesSelector,
  listMediaEntitiesSelector,
  listMediumCategoriesEntitiesSelector,
  listShopsEntitiesSelector,
  mediaEntitiesSelector,
  mediumHasBrandsRelationsSelector,
  mediumHasCharactersRelationsSelector,
  mediumHasCollectionsRelationsSelector,
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

const currentHelpersBrandSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentHelpersBrandSearchString' ]);
const currentHelpersCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentHelpersCharacterSearchString' ]);
const currentHelpersShopSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentHelpersShopSearchString' ]);

const currentCollectionsBrandSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCollectionsBrandSearchString' ]);
const currentCollectionsCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCollectionsCharacterSearchString' ]);

const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentBroadcastersSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentMediumCategoriesSearchString' ]);
const popUpMessageSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'popUpMessage' ]);

const searchedHelpersBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentHelpersBrandSearchStringSelector);
const searchedHelpersCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentHelpersCharacterSearchStringSelector);
const searchedHelpersShopIdsSelector = createEntityIdsByRelationSelector(searchStringHasShopsRelationsSelector, currentHelpersShopSearchStringSelector);

const searchedCollectionsBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentCollectionsBrandSearchStringSelector);
const searchedCollectionsCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCollectionsCharacterSearchStringSelector);

const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsRelationsSelector, currentSeriesEntryIdSelector);
const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);

const episodeBrandsSelector = createEntitiesByRelationSelector(mediumHasBrandsRelationsSelector, currentEpisodeIdSelector, listBrandsEntitiesSelector);
const episodeCharactersSelector = createEntitiesByRelationSelector(mediumHasCharactersRelationsSelector, currentEpisodeIdSelector, listCharactersEntitiesSelector);
const episodeCollectionsSelector = createEntitiesByRelationSelector(mediumHasCollectionsRelationsSelector, currentEpisodeIdSelector, listCollectionsEntitiesSelector);
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
  episodeCollections: episodeCollectionsSelector,
  episodeShops: episodeShopsSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  hasTitle: hasTitleSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  popUpMessage: popUpMessageSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedCollectionsBrandIds: searchedCollectionsBrandIdsSelector,
  searchedCollectionsCharacterIds: searchedCollectionsCharacterIdsSelector,
  searchedHelpersBrandIds: searchedHelpersBrandIdsSelector,
  searchedHelpersCharacterIds: searchedHelpersCharacterIdsSelector,
  searchedHelpersShopIds: searchedHelpersShopIdsSelector,
  searchedMediumCategoryIds: searchedMediumCategoryIdsSelector,
  searchedSeasonIds: searchedSeasonIdsSelector,
  searchedSeriesEntryIds: searchedSeriesEntryIdsSelector,
  seasonsById: listMediaEntitiesSelector,
  seriesEntriesById: listMediaEntitiesSelector,
  shopsById: listShopsEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
