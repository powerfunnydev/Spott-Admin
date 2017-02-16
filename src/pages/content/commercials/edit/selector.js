import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import { LAZY } from '../../../../constants/statusTypes';
import { currentModalSelector } from '../../../../selectors/global';
import { serializeFilterHasCharacters } from '../../../../reducers/utils';
import {
  broadcastersEntitiesSelector,
  collectionHasCollectionItemsRelationsSelector,
  contentProducersEntitiesSelector,
  createEntitiesByRelationSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  filterHasCharactersRelationsSelector,
  listBrandsEntitiesSelector,
  listCharactersEntitiesSelector,
  listCollectionsEntitiesSelector,
  listCollectionItemsEntitiesSelector,
  listMediaEntitiesSelector,
  listPersonsEntitiesSelector,
  listProductsEntitiesSelector,
  mediaEntitiesSelector,
  mediumHasCollectionsRelationsSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasCharactersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  searchStringHasMediaRelationsSelector,
  searchStringHasPersonsRelationsSelector,
  searchStringHasProductsRelationsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'commercialEdit';
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);

const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');
const hasBannerSelector = createFormValueSelector(formName, 'hasBanner');
const bannerSystemLinkTypeSelector = createFormValueSelector(formName, 'bannerSystemLinkType');
const bannerInternalLinkTypeSelector = createFormValueSelector(formName, 'bannerInternalLinkType');

const currentCommercialIdSelector = (state, props) => props.params.commercialId;
const currentCommercialSelector = createEntityByIdSelector(mediaEntitiesSelector, currentCommercialIdSelector);

const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBrandsSearchString' ]);
const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBroadcastersSearchString' ]);
const currentCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentCharacterSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentContentProducersSearchString' ]);

const currentCollectionsBrandSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentCollectionsBrandSearchString' ]);
const currentCollectionsCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentCollectionsCharacterSearchString' ]);
const currentCollectionsProductSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentCollectionsProductSearchString' ]);

// Link brands
const currentBannerLinkBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBannerLinkBrandsSearchString' ]);
const currentBannerLinkCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBannerLinkCharactersSearchString' ]);
const currentBannerLinkMediaSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBannerLinkMediaSearchString' ]);
const currentBannerLinkPersonsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'edit', 'currentBannerLinkPersonsSearchString' ]);

const collectionsCharactersFilterKeySelector = createSelector(
  currentCollectionsCharacterSearchStringSelector,
  currentCommercialIdSelector,
  (searchString, mediumId) => serializeFilterHasCharacters({ searchString }, mediumId)
);

const helpersCharactersFilterKeySelector = createSelector(
  currentCommercialIdSelector,
  (mediumId) => serializeFilterHasCharacters({}, mediumId)
);

const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentCharactersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);

const searchedCollectionsBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentCollectionsBrandSearchStringSelector);
const searchedCollectionsCharacterIdsSelector = createEntityIdsByRelationSelector(filterHasCharactersRelationsSelector, collectionsCharactersFilterKeySelector);
const searchedCollectionsProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentCollectionsProductSearchStringSelector);

// Link brand
const searchedBannerLinkBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBannerLinkBrandsSearchStringSelector);
const searchedBannerLinkCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentBannerLinkCharactersSearchStringSelector);
const searchedBannerLinkMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentBannerLinkMediaSearchStringSelector);
const searchedBannerLinkPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentBannerLinkPersonsSearchStringSelector);

const commercialCharactersSelector = createEntitiesByRelationSelector(filterHasCharactersRelationsSelector, helpersCharactersFilterKeySelector, listCharactersEntitiesSelector);
const commercialCollectionsSelector = createEntitiesByRelationSelector(mediumHasCollectionsRelationsSelector, currentCommercialIdSelector, listCollectionsEntitiesSelector);

const collectionsSelector = createSelector(
  commercialCollectionsSelector,
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

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  bannerInternalLinkType: bannerInternalLinkTypeSelector,
  bannerSystemLinkType: bannerSystemLinkTypeSelector,
  broadcastersById: broadcastersEntitiesSelector,
  brandsById: listBrandsEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  commercialCharacters: commercialCharactersSelector,
  commercialCollections: collectionsSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentCommercial: currentCommercialSelector,
  currentModal: currentModalSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  hasBanner: hasBannerSelector,
  mediaById: listMediaEntitiesSelector,
  personsById: listPersonsEntitiesSelector,
  productsById: listProductsEntitiesSelector,
  searchedBannerLinkBrandIds: searchedBannerLinkBrandIdsSelector,
  searchedBannerLinkCharacterIds: searchedBannerLinkCharacterIdsSelector,
  searchedBannerLinkMediumIds: searchedBannerLinkMediumIdsSelector,
  searchedBannerLinkPersonIds: searchedBannerLinkPersonIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedCollectionsBrandIds: searchedCollectionsBrandIdsSelector,
  searchedCollectionsCharacterIds: searchedCollectionsCharacterIdsSelector,
  searchedCollectionsProductIds: searchedCollectionsProductIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  supportedLocales: supportedLocalesSelector
});
