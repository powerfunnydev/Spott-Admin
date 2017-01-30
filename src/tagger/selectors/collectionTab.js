import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import { LAZY } from '../../constants/statusTypes';
import { serializeFilterHasCharacters } from '../../reducers/utils';
import { currentMediumIdSelector } from './common';
import {
  collectionHasCollectionItemsRelationsSelector,
  createEntitiesByRelationSelector,
  createEntityIdsByRelationSelector,
  filterHasCharactersRelationsSelector,
  listBrandsEntitiesSelector,
  listCharactersEntitiesSelector,
  listCollectionItemsEntitiesSelector,
  listCollectionsEntitiesSelector,
  listProductsEntitiesSelector,
  mediumHasCollectionsRelationsSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasProductsRelationsSelector
} from '../../selectors/data';

const currentCollectionsBrandSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'collections', 'currentCollectionsBrandSearchString' ]);
const currentCollectionsCharacterSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'collections', 'currentCollectionsCharacterSearchString' ]);
const currentCollectionsProductSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'collections', 'currentCollectionsProductSearchString' ]);

const collectionsCharactersFilterKeySelector = createSelector(
  currentCollectionsCharacterSearchStringSelector,
  currentMediumIdSelector,
  (searchString, mediumId) => serializeFilterHasCharacters({ searchString }, mediumId)
);

const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentCollectionsBrandSearchStringSelector);
const searchedCharacterIdsSelector = createEntityIdsByRelationSelector(filterHasCharactersRelationsSelector, collectionsCharactersFilterKeySelector);
const searchedProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentCollectionsProductSearchStringSelector);

const movieCollectionsSelector = createEntitiesByRelationSelector(mediumHasCollectionsRelationsSelector, currentMediumIdSelector, listCollectionsEntitiesSelector);

const collectionsSelector = createSelector(
  movieCollectionsSelector,
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
  test: currentCollectionsProductSearchStringSelector,
  brandsById: listBrandsEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  mediumId: currentMediumIdSelector,
  mediumCollections: collectionsSelector,
  productsById: listProductsEntitiesSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedCharacterIds: searchedCharacterIdsSelector,
  searchedProductIds: searchedProductIdsSelector
});
