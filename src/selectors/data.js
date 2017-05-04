import { List, Map } from 'immutable';
import { createSelector } from 'reselect';
import { LAZY } from '../constants/statusTypes';

export const agesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'ages' ]);
export const audiencesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'audiences' ]);
export const availabilitiesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'availabilities' ]);
export const brandDashboardEventsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'brandDashboardEvents' ]);
export const brandsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'brands' ]);
export const broadcastChannelsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'broadcastChannels' ]);
export const broadcastersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'broadcasters' ]);
export const charactersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'characters' ]);
export const collectionsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'collections' ]);
export const contentProducersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'contentProducers' ]);
export const countriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'countries' ]);
export const cropsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'crops' ]);
export const eventsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'events' ]);
export const faceImagesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'faceImages' ]);
export const gendersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'genders' ]);
export const languagesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'languages' ]);
export const listBrandsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listBrands' ]);
export const listCharactersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listCharacters' ]);
export const listCollectionItemsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listCollectionItems' ]);
export const listCollectionsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listCollections' ]);
export const listCropsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listCrops' ]);
export const listMediaEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listMedia' ]);
export const listMediumCategoriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listMediumCategories' ]);
export const listPersonsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listPersons' ]);
export const listProductCategoriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listProductCategories' ]);
export const listProductsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listProducts' ]);
export const listPushNotificationDestinationsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listPushNotificationDestinations' ]);
export const listPushNotificationsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'pushNotifications' ]);
export const listShopsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listShops' ]);
export const listSpottsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listSpotts' ]);
export const listTagsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listTags' ]);
export const listTopicsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listTopics' ]);
export const mediaEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'media' ]);
export const mediumCategoriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'mediumCategories' ]);
export const personsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'persons' ]);
export const productOfferingsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'productOfferings' ]);
export const productsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'products' ]);
export const pushNotificationEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'pushNotifications' ]);
export const scheduleEntriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'scheduleEntries' ]);
export const shopsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'shops' ]);
export const similarProductsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'similarProducts' ]);
export const spottsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'spotts' ]);
export const tagsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'tags' ]);
export const topicsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'topics' ]);
export const topMediaEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'topMedia' ]);
export const topPeopleEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'topPeople' ]);
export const topProductsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'topProducts' ]);
export const tvGuideEntriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'tvGuideEntries' ]);
export const usersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'users' ]);
export const videosEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'videos' ]);
export const filterHasBrandsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasBrands' ]);
export const filterHasBroadcasterChannelsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasBroadcastChannels' ]);
export const filterHasBroadcastersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasBroadcasters' ]);
export const filterHasCharactersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasCharacters' ]);
export const filterHasCommercialsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasCommercials' ]);
export const filterHasContentProducersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasContentProducers' ]);
export const filterHasCountriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasCountries' ]);
export const filterHasDemographicsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasDemographics' ]);
export const filterHasEpisodesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasEpisodes' ]);
export const filterHasLanguagesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasLanguages' ]);
export const filterHasMediaRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasMedia' ]);
export const filterHasMediumCategoriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasMediumCategories' ]);
export const filterHasMoviesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasMovies' ]);
export const filterHasPersonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasPersons' ]);
export const filterHasProductCategoriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasProductCategories' ]);
export const filterHasProductsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasProducts' ]);
export const filterHasPushNotificationsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasPushNotifications' ]);
export const filterHasSeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSeasons' ]);
export const filterHasSeriesEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSeriesEntries' ]);
export const filterHasSeriesEntrySeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSeriesEntrySeasons' ]);
export const filterHasShopsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasShops' ]);
export const filterHasSpottsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSpotts' ]);
export const filterHasTopicsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasTopics' ]);
export const filterHasTopMediaRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasTopMedia' ]);
export const filterHasTopPeopleRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasTopPeople' ]);
export const filterHasTopProductsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasTopProducts' ]);
export const filterHasTvGuideEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasTvGuideEntries' ]);
export const filterHasUsersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasUsers' ]);

export const searchStringHasBrandsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasBrands' ]);
export const searchStringHasBroadcastChannelsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasBroadcastChannels' ]);
export const searchStringHasCharactersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasCharacters' ]);
export const searchStringHasMediaRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasMedia' ]);
export const searchStringHasMediumCategoriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasMediumCategories' ]);
export const searchStringHasBroadcastersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasBroadcasters' ]);
export const searchStringHasContentProducersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasContentProducers' ]);
export const searchStringHasPersonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasPersons' ]);
export const searchStringHasProductsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasProducts' ]);
export const searchStringHasProductCategoriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasProductCategories' ]);
export const searchStringHasPushNotificationDestinationsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasPushNotificationDestinations' ]);
export const searchStringHasUsersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasUsers' ]);
export const searchStringHasShopsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasShops' ]);
export const searchStringHasSeriesEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasSeriesEntries' ]);
export const searchStringHasSeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasSeasons' ]);
export const searchStringHasTagsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasTags' ]);
export const searchStringHasTopicsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasTopics' ]);

export const characterHasFaceImagesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'characterHasFaceImages' ]);
export const collectionHasCollectionItemsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'collectionHasCollectionItems' ]);
export const commercialHasScheduleEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'commercialHasScheduleEntries' ]);
export const imageHasSuggestedProductsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'imageHasSuggestedProducts' ]);
export const mediumHasAudiencesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasAudiences' ]);
export const mediumHasAvailabilitiesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasAvailabilities' ]);
export const mediumHasBrandsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasBrands' ]);
export const mediumHasCollectionsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasCollections' ]);
export const mediumHasShopsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasShops' ]);
export const mediumHasTvGuideEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasTvGuideEntries' ]);
export const mediumHasUnassignedProductsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasUnassignedProducts' ]);
export const personHasFaceImagesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'personHasFaceImages' ]);
export const productHasProductOfferingsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'productHasProductOfferings' ]);
export const productHasSimilarProductsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'productHasSimilarProducts' ]);
export const seriesEntryHasSeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'seriesEntryHasSeasons' ]);
export const seriesEntryHasEpisodesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'seriesEntryHasEpisodes' ]);
export const seasonHasEpisodesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'seasonHasEpisodes' ]);
export const videoHasCropsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'videoHasCrops' ]);

export const agesListSelector = (state) => state.getIn([ 'data', 'lists', 'ages' ]);
export const brandDashboardEventsListSelector = (state) => state.getIn([ 'data', 'lists', 'brandDashboardEvents' ]);
export const eventsListSelector = (state) => state.getIn([ 'data', 'lists', 'events' ]);
export const gendersListSelector = (state) => state.getIn([ 'data', 'lists', 'genders' ]);
export const broadcastChannelsListSelector = (state) => state.getIn([ 'data', 'lists', 'broadcastChannels' ]);
export const episodesListSelector = (state) => state.getIn([ 'data', 'lists', 'episodes' ]);

/**
 * Utility selector factory for accessing related id's.
 *
 * Creates a selector for selecting id's for the entry specified by relationEntryKey within the given relation.
 * @param {function} relationSelector
 * @param {function} relationEntryKeySelector
 * @return {Map} An immutable map with a '_status' and 'data':
 *   The field _status can contain any of the predefined status types (see /constants/statusTypes.js),
 *   the field data is an immutable list containing the entity ids.
 *   Both elements are always present.
 */
export function createEntityIdsByRelationSelector (relationSelector, relationEntryKeySelector) {
  return createSelector(relationSelector, relationEntryKeySelector, (relation, relationEntryKey) => {
    // Get the entry in the relation, being a Map({ <relationEntryKey>: Map({ _status, _error, data }) })
    const relationEntry = relation.get(relationEntryKey);
    // If we did not found such an entry, no fetching has started yet.
    if (!relationEntry) {
      return Map({ _status: LAZY, data: List() });
    }
    // Good, we have a relation. Get its data (a list of id's, if already there)
    return relationEntry.set('data', relationEntry.get('data') || List()); // Ensure we always have a list in 'data'.
  });
}

/**
 * Utility selector factory for accessing related entities.
 *
 * Creates a selector for selecting entities for the entry specified by relationEntryKey within the given relation.
 * @param {function} relationSelector
 * @param {function} relationEntryKeySelector
 * @param {function} entitiesByIdSelector
 * @return {Map} An immutable map with a '_status' and 'data':
 *   The field _status can contain any of the predefined status types (see /constants/statusTypes.js),
 *   the field data is an immutable list containing the entities.
 *   Both elements are always present.
 */
export function createEntitiesByRelationSelector (relationSelector, relationEntryKeySelector, entitiesByIdSelector) {
  return createSelector(entitiesByIdSelector, createEntityIdsByRelationSelector(relationSelector, relationEntryKeySelector), (entitiesById, relation) => {
    // Good, we have a relation. Map over its data (a list of id's, if already there) and substitute by the entities.
    return relation.set('data', relation.get('data').map((id) => entitiesById.get(id)));
  });
}

/**
 * Utility selector factory for accessing an entity by id.
 *
 * Creates a selector for the entity with given id's within the given entities.
 * @param {function} entitiesSelector
 * @param {function} entityKeySelector
 * @return {Map} An immutable map with a '_status' and 'data':
 *   The field _status can contain any of the predefined status types (see /constants/statusTypes.js),
 *   the field data is an immutable list containing the entity ids.
 *   Both elements are always present.
 */
export function createEntityByIdSelector (entitiesSelector, entityKeySelector) {
  return createSelector(entitiesSelector, entityKeySelector, (entities, entityKey) => {
    // For debugging purposes
    if (!entities) {
      console.warn('createEntityByIdSelector: entities undefined for selector', entitiesSelector);
      return Map();
    }
    // Get the entity with given id within entities, being a Map({ <entityKey>: Map({ _status, _error, ...data }) })
    const entity = entities.get(entityKey);
    // If we failed to find the entity, no fetching has started yet.
    if (!entity) {
      return Map({ _status: LAZY });
    }
    // Good, we have an entity. Return it!
    return entity;
  });
}

export function createEntitiesByListSelector (listSelector, entitiesByIdSelector) {
  return createSelector(entitiesByIdSelector, listSelector, (entitiesById, list) => {
    // If we did not have a list container, no fetching has started yet.
    if (!list) {
      return Map({ _status: LAZY, data: List() });
    }
    // Good, we have a list container. Ensure we always have a list in 'data', then
    // resolve each item in the underlying 'data' list.
    return list.set('data', (list.get('data') || List()).map((id) => {
      return entitiesById.get(id);
    }));
  });
}
