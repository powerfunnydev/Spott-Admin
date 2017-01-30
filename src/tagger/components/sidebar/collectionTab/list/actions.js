import { searchMediumCharacters as dataSearchMediumCharacters } from '../../../../../actions/character';
import { fetchMediumCollections } from '../../../../../actions/collection';
import { fetchCollectionItems } from '../../../../../actions/collectionItem';
import { searchBrands as dataSearchBrands } from '../../../../../actions/brand';
import { searchProducts as dataSearchProducts } from '../../../../../actions/product';

export { fetchCollection as loadCollection, deleteCollection, moveCollection, persistCollection } from '../../../../../actions/collection';
export { fetchCollectionItem as loadCollectionItem, fetchCollectionItems, deleteCollectionItem, persistCollectionItem, moveCollectionItem, moveCollectionItemToOtherCollection } from '../../../../../actions/collectionItem';

export const COLLECTIONS_BRANDS_SEARCH_START = 'COLLECTIONS/COLLECTIONS_BRANDS_SEARCH_START';
export const COLLECTIONS_BRANDS_SEARCH_ERROR = 'COLLECTIONS/COLLECTIONS_BRANDS_SEARCH_ERROR';

export const COLLECTIONS_CHARACTERS_SEARCH_START = 'COLLECTIONS/COLLECTIONS_CHARACTERS_SEARCH_START';
export const COLLECTIONS_CHARACTERS_SEARCH_ERROR = 'COLLECTIONS/COLLECTIONS_CHARACTERS_SEARCH_ERROR';

export const COLLECTIONS_PRODUCTS_SEARCH_START = 'COLLECTIONS/COLLECTIONS_PRODUCTS_SEARCH_START';
export const COLLECTIONS_PRODUCTS_SEARCH_ERROR = 'COLLECTIONS/COLLECTIONS_PRODUCTS_SEARCH_ERROR';

// Collections
// ///////////

/* Search on all brands. Can change in the future to medium brands. */
export function searchCollectionsBrands (searchString) {
  return async (dispatch) => {
    try {
      await dispatch({ type: COLLECTIONS_BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: COLLECTIONS_BRANDS_SEARCH_ERROR });
    }
  };
}

/* Search on the cast of a medium. */
export function searchCollectionsCharacters (mediumId, searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: COLLECTIONS_CHARACTERS_SEARCH_START, searchString });
      return await dispatch(dataSearchMediumCharacters({ mediumId, searchString }));
    } catch (error) {
      dispatch({ error, type: COLLECTIONS_CHARACTERS_SEARCH_ERROR });
    }
  };
}

/* Search on all products. */
export function searchCollectionsProducts (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: COLLECTIONS_PRODUCTS_SEARCH_START, searchString });
      return await dispatch(dataSearchProducts({ searchString }));
    } catch (error) {
      dispatch({ error, type: COLLECTIONS_PRODUCTS_SEARCH_ERROR });
    }
  };
}

export function loadCollections ({ mediumId }) {
  return async (dispatch, getState) => {
    const { data: collections } = await dispatch(fetchMediumCollections({ mediumId }));
    for (const { id } of collections) {
      await dispatch(fetchCollectionItems({ collectionId: id }));
    }
    return collections;
  };
}
