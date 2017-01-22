import { searchMediumBrands as dataSearchMediumBrands } from '../../../../actions/brand';
import { searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';
import { fetchMediumCollections } from '../../../../actions/collection';
import { fetchCollectionItems } from '../../../../actions/collectionItem';

export { fetchCollection as loadCollection, deleteCollection, persistCollection } from '../../../../actions/collection';
export { fetchCollectionItem as loadCollectionItem, fetchCollectionItems, deleteCollectionItem, persistCollectionItem, moveCollectionItem } from '../../../../actions/collectionItem';
export const MEDIUM_BRANDS_SEARCH_ERROR = 'HELPERS_COLLECTIIONS/MEDIUM_BRANDS_SEARCH_ERROR';
export const MEDIUM_CHARACTERS_SEARCH_ERROR = 'HELPERS_COLLECTIIONS/MEDIUM_CHARACTERS_SEARCH_ERROR';

// Search on all brands of a specific medium.
export function searchMediumBrands (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumBrands({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_BRANDS_SEARCH_ERROR });
    }
  };
}

// Search on all characters (cast) of a specific medium.
export function searchMediumCharacters (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumCharacters({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_CHARACTERS_SEARCH_ERROR });
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
