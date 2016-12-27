import { fromJS, List, Map } from 'immutable';
import { normalize, Schema, arrayOf } from 'normalizr';
import * as actionTypes from '../constants/actionTypes';
import * as sceneGroupActions from '../actions/sceneGroup';
import { CHARACTER, PRODUCT } from '../constants/appearanceTypes';
import * as organizer from '../actions/organizer';
import { ERROR, FETCHING, LOADED, UPDATING } from '../constants/statusTypes';
import * as characterActions from '../actions/character';
import * as productActions from '../actions/product';

const appearance = new Schema('appearances', { idAttribute: 'appearanceId' });
const character = new Schema('characters');
const sceneGroup = new Schema('sceneGroups');
const product = new Schema('products');
const productGroup = new Schema('productGroups');
const scene = new Schema('scenes');

/**
 * Helper function to fetch an entity and set it's _status to either
 * 'updating' or 'fetching'.
 * @param {Object} state
 * @param {string} type The type of the entity, e.g. 'products' or 'characters'.
 * @param {string} id The id of the entity.
 */
function _fetchEntity (state, type, id) {
  // Get the entity from the state, which can be undefined.
  const entity = state.getIn([ 'entities', type, id ]);
  // The entity is already fetched if the entity exists and there is no status.
  const isFetched = entity && !entity.get('_status');
  // When the entity is already present, set it's status to 'updating'.
  if (isFetched) {
    return state.mergeIn([ 'entities', type, id ], { _status: UPDATING });
  }
  // If the entity does not exist, set the status to 'fetching'.
  return state.mergeIn([ 'entities', type, id ], { _status: FETCHING });
}

// path is e.g., [ 'relations', type, id ]
function setFetchingStatus (state, path) {
  // Get the data (entity/relations) from the state, which can be undefined.
  const data = state.getIn(path);
  // The data is already fetched if the data exist and there is no status.
  const loaded = data && data.get('_status') === LOADED;
  // When the data is already present, set it's status to 'updating'.
  // This way we now if there is already data, but it's updating.
  if (loaded) {
    return state.mergeIn(path, { _status: UPDATING });
  }
  // If the data do not exist, set the status to 'fetching'.
  return state.mergeIn(path, { _status: FETCHING });
}

function _updateProductAppearances (state, action) {
  // TODO: refactor to 'data'.
  const data = action.records || action.data;
  // Set the type of appearance to product.
  for (const productAppearance of data) {
    productAppearance.type = PRODUCT;
  }
  const { entities: { appearances: appearanceEntities }, result: appearancesResult } = normalize(data, arrayOf(appearance));
  return state
    .mergeIn([ 'entities', 'appearances' ], appearanceEntities)
    .setIn([ 'relations', 'sceneHasProducts', action.sceneId ], List(appearancesResult));
}

// path is e.g., [ 'relations', type, id ]
function fetchStart (state, path) {
  // Get the data (entity/relations) from the state, which can be undefined.
  const data = state.getIn(path);
  // The data is already fetched if the data exist and there is no status.
  const loaded = data && data.get('_status') === LOADED;
  // When the data is already present, set it's status to 'updating'.
  // This way we now if there is already data, but it's updating.
  if (loaded) {
    return state.mergeIn(path, { _status: UPDATING });
  }
  // If the data do not exist, set the status to 'fetching'.
  return state.mergeIn(path, { _status: FETCHING });
}

function fetchSuccess (state, path, data) {
  return state.setIn(path, fromJS({ ...data, _status: LOADED }));
}

function fetchError (state, path, error) {
  return state.setIn(path, Map({ _error: error, _status: ERROR }));
}

// TRANSFORMS INPUT: [ { id, matchPercentage, product }]
// TO: [ { id, matchPercentage, productId }]
// RETURNS [ product ]
function stripSimilarProducts (similarProducts) {
  const result = [];
  for (let i = 0; i < similarProducts.length; i++) {
    const similarProduct = similarProducts[i];
    const prod = similarProduct.product;

    // Add productId to similar product relation and remove product property.
    similarProduct.productId = prod.id;
    Reflect.deleteProperty(similarProduct, 'product');
    result.push(prod);
  }
  return result;
}

/**
  * The data reducer is responsible for storing all entities and relations
  * between entities. When characters, products, etc. are fetched from the server
  * we store these objects in entities, where the key is the id of the object
  * and the value the whole object. E.g. if we fetch a video and his scenes
  * we store the video and scene objects in entities, and we store a reference
  * to the scenes that belong to the video in the videoHasScenes object. This
  * object has as key the videoId and as value an array of sceneIds.
  *
  * Each object under entities (characters, products,...) maps id's on the
  * actual data. When fetching, the id is mapped on an immutable map
  * { _status: 'fetching' }. In case of an error the id is mapped on an immutable
  * map { _error: <error>, status: 'error' }.
  *
  * data
  * -> entities
  *    -> appearances
  *    -> brands
  *    -> characters
  *    -> globalAppearances
  *    -> products
  *    -> productGroups
  *    -> scenes
  *    -> sceneGroups
  *    -> media
  *    -> videos
  * -> relations
  *    -> characterHasAppearances
  *    -> characterSearch { searchString: [ id ] }
  *    -> characterHasProductGroups { characterId: [ { id, name, products: [ { characterId, productId, relevance } ] } ] }
  *    -> mediumHasProductGroups { mediumId: [ { id, name, products: [ { characterId, productId, relevance } ] } ] }
  *    -> productHasSimilarProducts { productId: [ { id, matchPercentage, product, productId } ] }
  *    -> productSearch { searchString: [ id ] }
  *    -> sceneHasCharacters [{ id, appearanceId }]
  *    -> sceneHasProducts [{ appearanceId, id, point: { x, y }, relevance }]
  *    -> videoHasProducts
  *    -> videoHasGlobalProducts [{ appearanceId, id, relevance }]
  *    -> videoHasSceneGroups [sceneGroupId]
  *    -> videoHasScenes
  */
export default (state = fromJS({
  entities: {
    appearances: {}, brands: {}, characters: {}, globalAppearances: {}, products: {},
    productGroups: {}, sceneGroups: {}, scenes: {}, media: {}, videos: {}
  },
  relations: {
    characterHasAppearances: {}, characterSearch: {}, characterHasProductGroups: {}, mediumHasProductGroups: {},
    productHasSimilarProducts: {}, productSearch: {}, sceneHasCharacters: {},
    sceneHasProducts: {}, videoHasProducts: {}, videoHasGlobalProducts: {}, videoHasScenes: {}, videoHasSceneGroups: {}
  }
}), action) => {
  switch (action.type) {
    // Brands
    // ------

    case actionTypes.BRAND_FETCH_START:
      return _fetchEntity(state, 'brands', action.brandId);
    case actionTypes.BRAND_FETCH_SUCCESS:
      return state.setIn([ 'entities', 'brands', action.brandId ], Map(action.data));
    case actionTypes.BRAND_FETCH_ERROR:
      return state.setIn([ 'entities', 'brands', action.brandId ], Map({ _error: action.error, _status: ERROR }));

    // Characters
    // ----------

    case actionTypes.CHARACTER_FETCH_START:
      return _fetchEntity(state, 'characters', action.characterId);
    case actionTypes.CHARACTER_FETCH_SUCCESS:
      return state.setIn([ 'entities', 'characters', action.characterId ], Map(action.data));
    case actionTypes.CHARACTER_FETCH_ERROR:
      return state.setIn([ 'entities', 'characters', action.characterId ], Map({ _error: action.error, _status: ERROR }));

    // Mediums
    // -------

    case actionTypes.MEDIUM_FETCH_START:
      return state.setIn([ 'entities', 'media', action.mediumId ], Map({ _status: FETCHING }));
    case actionTypes.MEDIUM_FETCH_SUCCESS:
      return state.setIn([ 'entities', 'media', action.mediumId ], fromJS(action.record));
    case actionTypes.MEDIUM_FETCH_ERROR:
      return state.setIn([ 'entities', 'media', action.mediumId ], Map({ _error: action.error, _status: ERROR }));

    // Products
    // --------

    case actionTypes.PRODUCT_FETCH_START:
      return _fetchEntity(state, 'products', action.productId);
    case actionTypes.PRODUCT_FETCH_SUCCESS:
      // The product already exists with some partial information. Extend it (imageUrl, shortName, ...)
      return state
        .mergeIn([ 'entities', 'products', action.productId ], Map(action.data))
        // Remove the status: '_updating'
        .deleteIn([ 'entities', 'products', action.productId, '_status' ]);
    case actionTypes.PRODUCT_FETCH_ERROR:
      return state.setIn([ 'entities', 'products', action.productId ], Map({ _error: action.error, _status: ERROR }));

    // Similar products
    // ----------------

    case actionTypes.SIMILAR_PRODUCTS_FETCH_START:
      return fetchStart(state, [ 'relations', 'productHasSimilarProducts', action.productId ]);
    case actionTypes.SIMILAR_PRODUCTS_FETCH_SUCCESS: {
      const similarProductRelations = action.data; // similarProductRelations = [ { id, matchPercentage, product }]
      const products = stripSimilarProducts(similarProductRelations); // similarProductRelations = [ { id, matchPercentage, productId }]
      /* eslint no-return-assign: 0 */
      products.forEach((p) => p._status = LOADED); // Add _status 'loaded' to each fetched entity.

      const { entities: { products: productEntities } } = normalize(products, arrayOf(product));
      return state
        .mergeIn([ 'entities', 'products' ], productEntities)
        .setIn([ 'relations', 'productHasSimilarProducts', action.productId ], Map({ _status: LOADED, data: fromJS(similarProductRelations) }));
    }
    case actionTypes.SIMILAR_PRODUCTS_FETCH_ERROR:
      return fetchError(state, [ 'relations', 'productHasSimilarProducts', action.productId ], action.error);

    // Product groups
    // --------------
    case actionTypes.CHARACTER_PRODUCT_GROUP_PERSIST_SUCCESS:
    case actionTypes.PRODUCT_GROUP_PERSIST_SUCCESS:
      action.data._status = LOADED;
      return state.setIn([ 'entities', 'productGroups', action.id ], fromJS(action.data));

    case actionTypes.PRODUCT_GROUPS_FETCH_START:
      return setFetchingStatus(state, [ 'relations', 'mediumHasProductGroups', action.mediumId ]);
    case actionTypes.PRODUCT_GROUPS_FETCH_SUCCESS: {
      const { entities: { productGroups: productGroupEntities }, result: productGroupResult } = normalize(action.data, arrayOf(productGroup));
      return state
        .mergeIn([ 'entities', 'productGroups' ], productGroupEntities)
        .setIn([ 'relations', 'mediumHasProductGroups', action.mediumId ], Map({ _status: LOADED, data: fromJS(productGroupResult) }));
    }
    case actionTypes.PRODUCT_GROUPS_FETCH_ERROR:
      return setFetchingStatus([ 'relations', 'mediumHasProductGroups', action.mediumId ], Map({ _error: action.error, _status: ERROR }));

    case actionTypes.CHARACTER_PRODUCT_GROUPS_FETCH_START:
      return setFetchingStatus(state, [ 'relations', 'characterHasProductGroups', action.characterId ]);
    case actionTypes.CHARACTER_PRODUCT_GROUPS_FETCH_SUCCESS: {
      const { entities: { productGroups: productGroupEntities }, result: productGroupResult } = normalize(action.data, arrayOf(productGroup));
      return state
        .mergeIn([ 'entities', 'productGroups' ], productGroupEntities)
        .setIn([ 'relations', 'characterHasProductGroups', action.characterId ], Map({ _status: LOADED, data: fromJS(productGroupResult) }));
    }
    case actionTypes.CHARACTER_PRODUCT_GROUPS_FETCH_ERROR:
      return setFetchingStatus([ 'relations', 'characterHasProductGroups', action.characterId ], Map({ _error: action.error, _status: ERROR }));

    // Video products
    // --------------

    case actionTypes.VIDEO_PRODUCT_DELETE_SUCCESS: {
      const { entities: { appearances: appearanceEntities }, result: appearancesResult } = normalize(action.data, arrayOf(appearance));
      return state
        .mergeIn([ 'entities', 'globalAppearances' ], appearanceEntities)
        .setIn([ 'relations', 'videoHasGlobalProducts', action.videoId ], List(appearancesResult));
    }

    case productActions.VIDEO_PRODUCTS_FETCH_SUCCESS: {
      const { entities: { products: productEntities }, result: productsResult } = normalize(action.data, arrayOf(product));
      return state
        .mergeIn([ 'entities', 'products' ], productEntities)
        .setIn([ 'relations', 'videoHasProducts', action.videoId ], List(productsResult));
    }
    case actionTypes.VIDEO_PRODUCT_PERSIST_SUCCESS:
    case productActions.GLOBAL_PRODUCTS_FETCH_SUCCESS: {
      const { entities: { appearances: appearanceEntities }, result: appearancesResult } = normalize(action.data, arrayOf(appearance));
      return state
        .mergeIn([ 'entities', 'globalAppearances' ], appearanceEntities)
        .setIn([ 'relations', 'videoHasGlobalProducts', action.videoId ], List(appearancesResult));
    }
    case productActions.GLOBAL_PRODUCTS_FETCH_ERROR:
      return state.setIn([ 'relations', 'videoHasGlobalProducts', action.videoId ], List());

    // Scene groups
    // ------------

    case sceneGroupActions.SCENE_GROUPS_FETCH_START:
      return setFetchingStatus(state, [ 'relations', 'videoHasSceneGroups', action.characterId ]);
    case sceneGroupActions.SCENE_GROUPS_FETCH_SUCCESS: {
      const { entities: { sceneGroups: sceneGroupEntities }, result: sceneGroupResult } = normalize(action.data, arrayOf(sceneGroup));
      return state
        .mergeIn([ 'entities', 'sceneGroups' ], sceneGroupEntities)
        .setIn([ 'relations', 'videoHasSceneGroups', action.videoId ], Map({ _status: LOADED, data: fromJS(sceneGroupResult) }));
    }
    case sceneGroupActions.SCENE_GROUPS_FETCH_ERROR:
      return setFetchingStatus([ 'relations', 'videoHasSceneGroups', action.characterId ], Map({ _error: action.error, _status: ERROR }));

    // Search characters
    // -----------------

    case actionTypes.SEARCH_CHARACTERS_START:
      return setFetchingStatus(state, [ 'relations', 'characterSearch', action.searchString ]);
    case actionTypes.SEARCH_CHARACTERS_SUCCESS: {
      const { entities: { characters: characterEntities }, result: charactersResult } = normalize(action.data, arrayOf(character));
      return state
        .mergeIn([ 'entities', 'characters' ], characterEntities)
        .setIn([ 'relations', 'characterSearch', action.searchString ], Map({ _status: LOADED, data: List(charactersResult) }));
    }
    case actionTypes.SEARCH_CHARACTERS_ERROR:
      return setFetchingStatus([ 'relations', 'characterSearch', action.searchString ], Map({ _error: action.error, _status: ERROR }));

    // Search products
    // ---------------

    case actionTypes.SEARCH_PRODUCTS_START:
    case actionTypes.SEARCH_GLOBAL_PRODUCTS_START:
      return setFetchingStatus(state, [ 'relations', 'productSearch', action.searchString ]);
    case actionTypes.SEARCH_PRODUCTS_SUCCESS:
    case actionTypes.SEARCH_GLOBAL_PRODUCTS_SUCCESS: {
      const { entities: { products: productEntities }, result: productsResult } = normalize(action.data, arrayOf(product));
      return state
        .mergeIn([ 'entities', 'products' ], productEntities)
        .setIn([ 'relations', 'productSearch', action.searchString ], Map({ _status: LOADED, data: List(productsResult) }));
    }
    case actionTypes.SEARCH_PRODUCTS_ERROR:
    case actionTypes.SEARCH_GLOBAL_PRODUCTS_ERROR:
      return setFetchingStatus([ 'relations', 'productSearch', action.searchString ], Map({ _error: action.error, _status: ERROR }));

    // Videos
    // ------

    case actionTypes.VIDEO_FETCH_START:
      return state.setIn([ 'entities', 'videos', action.id ], Map({ _status: FETCHING }));
    case actionTypes.VIDEO_FETCH_SUCCESS:
      const { entities: { scenes: sceneEntities }, result: { id, scenes: scenesResult } } = normalize(action.record, {
        scenes: arrayOf(scene)
      });
      return state
        .setIn([ 'entities', 'videos', id ], Map({ id }))
        .mergeIn([ 'entities', 'scenes' ], sceneEntities)
        .setIn([ 'relations', 'videoHasScenes', id ], List(scenesResult));
    case actionTypes.VIDEO_FETCH_ERROR:
      return state.setIn([ 'entities', 'videos', action.id ], Map({ _error: action.error, _status: ERROR }));

    // Scenes
    // ------

    case actionTypes.SCENE_UPDATE_SUCCESS:
    case organizer.SCENE_UPDATE_SUCCESS:
      // We merge because otherwise we lose the sceneNumber.
      // We add a sceneNumber in the API layer.
      return state.mergeIn([ 'entities', 'scenes', action.sceneId ], Map(action.record));

    case characterActions.VIDEO_CHARACTERS_FETCH_SUCCESS: {
      const { entities: { characters: characterEntities } } = normalize(action.data, arrayOf(character));
      // Relations are stored in video.
      return state.mergeIn([ 'entities', 'characters' ], characterEntities);
    }

    case actionTypes.CHARACTERS_OF_SCENE_FETCH_START:
      // Do nothing when start to fetch the character ids. We will use the characters in the cache.
      return state;
    case characterActions.CHARACTER_APPEARANCES_FETCH_SUCCESS: {
      const data = action.data;
      // Set the type of appearance to character.
      for (const characterAppearance of data) {
        characterAppearance.type = CHARACTER;
      }
      const { entities: { appearances: appearanceEntities }, result: appearancesResult } = normalize(data, arrayOf(appearance));
      return state.mergeIn([ 'entities', 'appearances' ], appearanceEntities)
        .setIn([ 'relations', 'characterHasAppearances', action.characterId ], Map({ type: LOADED, data: fromJS(appearancesResult) }));
    }
    case actionTypes.CREATE_CHARACTER_MARKER_SUCCESS:
    case actionTypes.UPDATE_CHARACTER_MARKER_SUCCESS:
    case actionTypes.CHARACTERS_OF_SCENE_FETCH_SUCCESS:
    case actionTypes.CHARACTER_OF_SCENE_DELETE_SUCCESS: {
      // TODO refactor to 'data'.
      const data = action.records || action.data;
      // Set the type of appearance to character.
      for (const characterAppearance of data) {
        characterAppearance.type = CHARACTER;
      }
      const { entities: { appearances: appearanceEntities }, result: appearancesResult } = normalize(data, arrayOf(appearance));
      return state.mergeIn([ 'entities', 'appearances' ], appearanceEntities)
        .setIn([ 'relations', 'sceneHasCharacters', action.sceneId ], List(appearancesResult));
    }
    case actionTypes.CHARACTERS_OF_SCENE_FETCH_ERROR:
      return state.setIn([ 'relations', 'sceneHasCharacters', action.sceneId ], List());

    // Fetch the partial products on a scene.
    case actionTypes.SCENE_PRODUCTS_FETCH_SUCCESS:
    case actionTypes.PRODUCT_OF_SCENE_DELETE_SUCCESS:
    case actionTypes.CREATE_PRODUCT_MARKER_SUCCESS:
    case actionTypes.UPDATE_PRODUCT_MARKER_SUCCESS:
      return _updateProductAppearances(state, action);
    case actionTypes.CLEAR_PRODUCT_SUGGESTIONS:
    case actionTypes.CREATE_PRODUCT_MARKER_CANCEL:
    case actionTypes.UPDATE_PRODUCT_MARKER_CANCEL:
      return state.setIn([ 'relations', 'productSuggestions' ], null);

    case actionTypes.SCENE_PRODUCTS_FETCH_ERROR:
      // TODO: handle error, show in GUI.
      return state.setIn([ 'relations', 'sceneHasProducts', action.sceneId ], List());

    case actionTypes.PRODUCT_SUGGESTION_ADD_IMAGE_SUCCESS:
      // When we add an image to a product, all existing image receive a new identifier. For this reason,
      // we patch the product in our state tree with its new image id.
      return fetchSuccess(state, [ 'entities', 'products', action.productId ], action.data);

    case actionTypes.CHARACTER_OF_SCENE_DELETE_ERROR:
    case actionTypes.PRODUCT_OF_SCENE_DELETE_ERROR:
    case actionTypes.UPDATE_PRODUCT_MARKER_ERROR:
      // TODO: We should toast
      return state;

    case actionTypes.SUGGEST_PRODUCTS_SUCCESS: {
      // Normalizer seems to be unable to handle this situation, so perform a manual
      // form of normalization instead.
      // Here we build a hash of form [{ productEntities: { <id>: <product> }, suggestions: [ { accuracy: <x>, productId: <id> } ] }]
      const { productEntities, suggestions } = action.data.reduce((acc, curr) => {
        const productId = curr.product.id;
        const newProductEntities = { ...acc.productEntities };
        newProductEntities[productId] = curr.product;
        return {
          productEntities: newProductEntities,
          suggestions: [ ...acc.suggestions, { accuracy: curr.accuracy, productId } ]
        };
      }, {
        productEntities: {},
        suggestions: []
      });
      return state
        .mergeIn([ 'entities', 'products' ], productEntities)
        .setIn([ 'relations', 'productSuggestions' ], fromJS(suggestions));
    }
    default:
      return state;
  }
};
