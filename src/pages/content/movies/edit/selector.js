import { createSelector, createStructuredSelector } from 'reselect';
import { List, Map } from 'immutable';
import { LAZY } from '../../../../constants/statusTypes';
import { serializeFilterHasCharacters } from '../../../../reducers/utils';
import { currentModalSelector } from '../../../../selectors/global';
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
  listCollectionItemsEntitiesSelector,
  listCollectionsEntitiesSelector,
  listMediumCategoriesEntitiesSelector,
  listProductsEntitiesSelector,
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
  searchStringHasShopsRelationsSelector
} from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

export const formName = 'movieEdit';

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const formErrorsSelector = (state) => state.getIn([ 'form', formName, 'syncErrors' ]);
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentMovieIdSelector = (state, props) => { return props.params.movieId; };
const currentMovieSelector = createEntityByIdSelector(mediaEntitiesSelector, currentMovieIdSelector);

const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentBroadcastersSearchString' ]);
const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentContentProducersSearchString' ]);
const currentMediumCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentMediumCategoriesSearchString' ]);
const popUpMessageSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'popUpMessage' ]);

const currentHelpersBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentHelpersBrandsSearchString' ]);
const currentHelpersCharactersSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentHelpersCharacterSearchString' ]);
const currentHelpersShopSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentHelpersShopSearchString' ]);

const currentCollectionsBrandSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentCollectionsBrandSearchString' ]);
const currentCollectionsCharacterSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentCollectionsCharacterSearchString' ]);
const currentCollectionsProductSearchStringSelector = (state) => state.getIn([ 'content', 'movies', 'edit', 'currentCollectionsProductSearchString' ]);

const collectionsCharactersFilterKeySelector = createSelector(
  currentCollectionsCharacterSearchStringSelector,
  currentMovieIdSelector,
  (searchString, mediumId) => {
    console.warn('COLL SER', searchString, serializeFilterHasCharacters({ searchString }, mediumId));
    return serializeFilterHasCharacters({ searchString }, mediumId);
  }
);

const helpersCharactersFilterKeySelector = createSelector(
  currentMovieIdSelector,
  (mediumId) => serializeFilterHasCharacters({}, mediumId)
);

const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
const searchedMediumCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediumCategoriesRelationsSelector, currentMediumCategoriesSearchStringSelector);

const searchedHelpersBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentHelpersBrandsSearchStringSelector);
const searchedHelpersCharacterIdsSelector = createEntityIdsByRelationSelector(searchStringHasCharactersRelationsSelector, currentHelpersCharactersSearchStringSelector);
const searchedHelpersShopIdsSelector = createEntityIdsByRelationSelector(searchStringHasShopsRelationsSelector, currentHelpersShopSearchStringSelector);

const searchedCollectionsBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentCollectionsBrandSearchStringSelector);
const searchedCollectionsCharacterIdsSelector = createEntityIdsByRelationSelector(filterHasCharactersRelationsSelector, collectionsCharactersFilterKeySelector);
const searchedCollectionsProductIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductsRelationsSelector, currentCollectionsProductSearchStringSelector);

const movieBrandsSelector = createEntitiesByRelationSelector(mediumHasBrandsRelationsSelector, currentMovieIdSelector, listBrandsEntitiesSelector);
const movieCharactersSelector = createEntitiesByRelationSelector(filterHasCharactersRelationsSelector, helpersCharactersFilterKeySelector, listCharactersEntitiesSelector);
const movieCollectionsSelector = createEntitiesByRelationSelector(mediumHasCollectionsRelationsSelector, currentMovieIdSelector, listCollectionsEntitiesSelector);
const movieShopsSelector = createEntitiesByRelationSelector(mediumHasShopsRelationsSelector, currentMovieIdSelector, listShopsEntitiesSelector);

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
  _activeLocale: _activeLocaleSelector,
  brandsById: listBrandsEntitiesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  charactersById: listCharactersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentModal: currentModalSelector,
  currentMovie: currentMovieSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  mediumCategoriesById: listMediumCategoriesEntitiesSelector,
  movieBrands: movieBrandsSelector,
  movieCharacters: movieCharactersSelector,
  movieCollections: collectionsSelector,
  movieShops: movieShopsSelector,
  popUpMessage: popUpMessageSelector,
  productsById: listProductsEntitiesSelector,
  searchedHelpersBrandIds: searchedHelpersBrandIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedCollectionsBrandIds: searchedCollectionsBrandIdsSelector,
  searchedCollectionsCharacterIds: searchedCollectionsCharacterIdsSelector,
  searchedCollectionsProductIds: searchedCollectionsProductIdsSelector,
  searchedHelpersCharacterIds: searchedHelpersCharacterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector,
  searchedMediumCategoryIds: searchedMediumCategoryIdsSelector,
  searchedHelpersShopIds: searchedHelpersShopIdsSelector,
  shopsById: listShopsEntitiesSelector,
  supportedLocales: supportedLocalesSelector
});
