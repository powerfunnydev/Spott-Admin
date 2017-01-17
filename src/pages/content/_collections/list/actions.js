import { searchMediumBrands as dataSearchMediumBrands } from '../../../../actions/brand';
import { searchMediumCharacters as dataSearchMediumCharacters } from '../../../../actions/character';

export { fetchMediumCollections, deleteCollection, persistCollection } from '../../../../actions/collection';
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
