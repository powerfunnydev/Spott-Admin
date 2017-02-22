import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import { LAZY } from '../../../../constants/statusTypes';
import { serializeFilterHasCharacters, serializeFilterHasCountries, serializeFilterHasLanguages } from '../../../../reducers/utils';
import { currentModalSelector } from '../../../../selectors/global';
import {
  broadcastersEntitiesSelector,
  collectionHasCollectionItemsRelationsSelector,
  contentProducersEntitiesSelector,
  createEntitiesByRelationSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  filterHasCharactersRelationsSelector,
  filterHasCountriesRelationsSelector,
  filterHasLanguagesRelationsSelector,
  listBrandsEntitiesSelector,
  listCharactersEntitiesSelector,
  listCollectionItemsEntitiesSelector,
  listCollectionsEntitiesSelector,
  listProductsEntitiesSelector,
  listMediaEntitiesSelector,
  listMediumCategoriesEntitiesSelector,
  listShopsEntitiesSelector,
  mediaEntitiesSelector,
  mediumHasBrandsRelationsSelector,
  mediumHasCollectionsRelationsSelector,
  mediumHasShopsRelationsSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasProductsRelationsSelector,
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

export const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };
const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);

const currentHelpersBrandSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentHelpersBrandSearchString' ]);
const currentHelpersCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentHelpersCharacterSearchString' ]);
const currentHelpersShopSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentHelpersShopSearchString' ]);

const currentCollectionsBrandSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCollectionsBrandSearchString' ]);
const currentCollectionsCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCollectionsCharacterSearchString' ]);
const currentCollectionsProductSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentCollectionsProductSearchString' ]);

const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentSeriesEntrySearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentBroadcastersSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentMediumCategoriesSearchString' ]);
const popUpMessageSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'popUpMessage' ]);

// Audience
const currentAudienceCountriesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentAudienceCountriesSearchString' ]);
const currentAudienceLanguagesSearchStringSelector = (state) => state.getIn([ 'content', 'episodes', 'edit', 'currentAudienceLanguagesSearchString' ]);

const collectionsCharactersFilterKeySelector = createSelector(
  currentCollectionsCharacterSearchStringSelector,
  currentEpisodeIdSelector,
  (searchString, mediumId) => serializeFilterHasCharacters({ searchString }, mediumId)
);

const searchedHelpersBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentHelpersBrandSearchStringSelector);
const searchedHelpersCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentHelpersCharacterSearchStringSelector);
const searchedHelpersShopIdsSelector = createEntityIdsByRelationSelector(searchStringHasShopsRelationsSelector, currentHelpersShopSearchStringSelector);

const searchedCollectionsBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentCollectionsBrandSearchStringSelector);
const searchedCollectionsCharacterIdsSelector = createEntityIdsByRelationSelector(filterHasCharactersRelationsSelector, collectionsCharactersFilterKeySelector);
const searchedCollectionsProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentCollectionsProductSearchStringSelector);

const searchedSeriesEntryIdsSelector = createEntityIdsByRelationSelector(searchStringHasSeriesEntriesRelationsSelector, currentSeriesEntriesSearchStringSelector);
const searchedSeasonIdsSelector = createEntityIdsByRelationSelector(seriesEntryHasSeasonsRelationsSelector, currentSeriesEntryIdSelector);
const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);

const helpersCharactersFilterKeySelector = createSelector(
  currentEpisodeIdSelector,
  (mediumId) => serializeFilterHasCharacters({}, mediumId)
);

const episodeBrandsSelector = createEntitiesByRelationSelector(mediumHasBrandsRelationsSelector, currentEpisodeIdSelector, listBrandsEntitiesSelector);
const episodeCharactersSelector = createEntitiesByRelationSelector(filterHasCharactersRelationsSelector, helpersCharactersFilterKeySelector, listCharactersEntitiesSelector);
const episodeCollectionsSelector = createEntitiesByRelationSelector(mediumHasCollectionsRelationsSelector, currentEpisodeIdSelector, listCollectionsEntitiesSelector);
const episodeShopsSelector = createEntitiesByRelationSelector(mediumHasShopsRelationsSelector, currentEpisodeIdSelector, listShopsEntitiesSelector);

const collectionsSelector = createSelector(
  episodeCollectionsSelector,
  collectionHasCollectionItemsRelationsSelector,
  listCollectionItemsEntitiesSelector,
  (collections, collectionHasCollectionItems, listCollectionItemsEntities) => {
    return collections.set('data', collections.get('data').map((c) => {
      // Get the entry in the relation, being a Map({ <relationEntryKey>: Map({ _status, _error, data }) })
      let collectionItems = collectionHasCollectionItems.get(c.get('id'));
      // If we did not found such an entry, no fetching has started yet.
      if (!collectionItems) {
        return c.set('collectionItems', Map({ _status: LAZY, data: List() }));
      }
      // Good, we have a relation. Map over its data (a list of id's, if already there) and substitute by the entities.
      collectionItems = collectionItems.set('data', (collectionItems.get('data') || List()).map((id) => listCollectionItemsEntities.get(id)));
      return c.set('collectionItems', collectionItems);
    }));
  }
);

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
  episodeCollections: collectionsSelector,
  episodeShops: episodeShopsSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  hasTitle: hasTitleSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  popUpMessage: popUpMessageSelector,
  productsById: listProductsEntitiesSelector,
  searchedAudienceCountryIds: searchedAudienceCountryIdsSelector,
  searchedAudienceLanguageIds: searchedAudienceLanguageIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedCollectionsBrandIds: searchedCollectionsBrandIdsSelector,
  searchedCollectionsCharacterIds: searchedCollectionsCharacterIdsSelector,
  searchedCollectionsProductIds: searchedCollectionsProductIdsSelector,
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
