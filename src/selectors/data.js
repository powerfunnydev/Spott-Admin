import { List, Map } from 'immutable';
import { createSelector } from 'reselect';
import { LAZY } from '../constants/statusTypes';

export const availabilitiesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'availabilities' ]);
export const agesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'ages' ]);
export const broadcastChannelsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'broadcastChannels' ]);
export const broadcastersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'broadcasters' ]);
export const charactersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'characters' ]);
export const contentProducersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'contentProducers' ]);
export const eventsEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'events' ]);
export const gendersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'genders' ]);
export const listMediaEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'listMedia' ]);
export const mediaEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'media' ]);
export const tvGuideEntriesEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'tvGuideEntries' ]);
export const usersEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'users' ]);
export const videosEntitiesSelector = (state) => state.getIn([ 'data', 'entities', 'videos' ]);

export const filterHasBroadcastersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasBroadcasters' ]);
export const filterHasBroadcasterChannelsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasBroadcastChannels' ]);
export const filterHasContentProducersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasContentProducers' ]);
export const filterHasEpisodesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasEpisodes' ]);
export const filterHasSeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSeasons' ]);
export const filterHasTvGuideEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasTvGuideEntries' ]);
export const filterHasUsersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasUsers' ]);
export const filterHasSeriesEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSeriesEntries' ]);
export const filterHasSeriesEntrySeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'filterHasSeriesEntrySeasons' ]);

export const searchStringHasBroadcastChannelsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasBroadcastChannels' ]);
export const searchStringHasCharactersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasCharacters' ]);
export const searchStringHasMediaRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasMedia' ]);
export const searchStringHasBroadcastersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasBroadcasters' ]);
export const searchStringHasContentProducersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasContentProducers' ]);
export const searchStringHasUsersRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasUsers' ]);
export const searchStringHasSeriesEntriesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasSeriesEntries' ]);
export const searchStringHasSeasonsRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'searchStringHasSeasons' ]);

export const episodeHasTvGuideEntriesSelector = (state) => state.getIn([ 'data', 'relations', 'episodeHasTvGuideEntries' ]);
export const seriesEntryHasSeasonsSelector = (state) => state.getIn([ 'data', 'relations', 'seriesEntryHasSeasons' ]);
export const seasonHasEpisodesSelector = (state) => state.getIn([ 'data', 'relations', 'seasonHasEpisodes' ]);
export const mediumHasAvailabilitiesRelationsSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasAvailabilities' ]);
export const mediumHasCharactersSelector = (state) => state.getIn([ 'data', 'relations', 'mediumHasCharacters' ]);

export const agesListSelector = (state) => state.getIn([ 'data', 'lists', 'ages' ]);
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
