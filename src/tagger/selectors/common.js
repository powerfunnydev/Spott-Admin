import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import { LAZY } from '../constants/statusTypes';

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
 *    The field _status can contain any of the predefined status types (see /constants/statusTypes.js),
 *    the field data is an immutable list containing the entity ids.
 *    Both elements are always present.
 */
export function createEntityByIdSelector (entitiesSelector, entityKeySelector) {
  return createSelector(entitiesSelector, entityKeySelector, (entities, entityKey) => {
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

// Selectors related to the `app` part of the state tree.
export const characterSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'characterSearchString' ]);
export const copyAppearanceIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'copyAppearanceId' ]);
export const currentModalSelector = (state) => state.getIn([ 'tagger', 'tagger', 'modal', 'currentModal' ]);
export const currentSceneIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'currentSceneId' ]);
export const currentSceneImageIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'currentSceneImageId' ]);
export const currentMediumIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'currentMediumId' ]);
export const currentTabNameSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'currentTabName' ]);
export const currentVideoIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'currentVideoId' ]);
export const globalProductSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'globalProductSearchString' ]);
export const hideDifferentFramesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'hideDifferentFrames' ]);
export const hoveredAppearanceSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'hoveredAppearance' ]);
export const newMarkerPointSelector = (state) => state.getIn([ 'tagger', 'tagger', 'marker', 'newMarkerPoint' ]);
export const newMarkerRegionSelector = (state) => state.getIn([ 'tagger', 'tagger', 'marker', 'newMarkerRegion' ]);
export const productSearchStringSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'productSearchString' ]);
export const selectedAppearanceSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'selectedAppearance' ]);
export const updateAppearanceIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'app', 'updateAppearanceId' ]);

// Selectors related to the `data.relations` part of the state tree.
export const characterHasAppearancesRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'characterHasAppearances' ]);
export const characterSearchRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'characterSearch' ]);
export const characterHasProductGroupsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'characterHasProductGroups' ]);
export const mediumHasProductGroupsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'mediumHasProductGroups' ]);
export const productHasSimilarProductsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'productHasSimilarProducts' ]);
export const productSearchRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'productSearch' ]);
export const productSuggestionsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'productSuggestions' ]);
export const sceneHasCharactersRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'sceneHasCharacters' ]);
export const sceneHasProductsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'sceneHasProducts' ]);
export const videoHasProductsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'videoHasProducts' ]);
export const videoHasGlobalProductsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'videoHasGlobalProducts' ]);
export const videoHasScenesRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'videoHasScenes' ]);
export const videoHasSceneGroupsRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'relations', 'videoHasSceneGroups' ]);

// Selectors related to the `data.entities` part of the state tree.
export const appearanceEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'appearances' ]);
export const brandEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'brands' ]);
export const characterEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'characters' ]);
export const currentSceneSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'scenes', currentSceneIdSelector(state) ]);
export const globalAppearanceEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'globalAppearances' ]);
export const productEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'products' ]);
export const productGroupEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'productGroups' ]);
export const sceneEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'scenes' ]);
export const sceneGroupEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'sceneGroups' ]);
export const mediaEntitiesSelector = (state) => state.getIn([ 'tagger', 'tagger', 'data', 'entities', 'media' ]);

// Map (not a List!) of booleans, which once are similar, which not? The keys are the id's of the scene.
export const similarScenesOfSceneRelationsSelector = (state) => state.getIn([ 'tagger', 'tagger', 'similarFrames', 'similarScenesOfScene' ]);
export const similarScenesAppearanceSelector = (state) => state.getIn([ 'tagger', 'tagger', 'similarFrames', 'appearance' ]);
export const similarScenesAppearanceTypeSelector = (state) => state.getIn([ 'tagger', 'tagger', 'similarFrames', 'appearanceType' ]);

export const currentMediumSelector = createEntityByIdSelector(mediaEntitiesSelector, currentMediumIdSelector);

/**
 * Extracts the visible scenes of the current video from the state tree.
 */
export const scenesSelector = createSelector(
   currentVideoIdSelector,
   videoHasScenesRelationsSelector,
   sceneEntitiesSelector,
   (videoId, videoHasScenes, scenes) => {
     const hideHiddenFrames = true; // TODO
     // videoHasScenes and scenes are always present, but can be empty Immutable Map's.
     const sceneIds = videoHasScenes.get(videoId) || List();
     return sceneIds.reduce((sceneList, sceneId) => {
       const scene = scenes.get(sceneId);
       // Skip scene when we want to hide the hidden frames.
       if (!(hideHiddenFrames && scene.get('hidden'))) {
         return sceneList.push(scene);
       }
       return sceneList;
     }, List());
   }
 );
