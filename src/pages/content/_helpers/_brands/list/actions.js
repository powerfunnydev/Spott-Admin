import { searchMediumBrands as dataSearchMediumBrands } from '../../../../../actions/brand';

export { persistMediumBrand, deleteMediumBrand } from '../../../../../actions/brand';
export const MEDIUM_BRANDS_SEARCH_ERROR = 'HELPERS_BRANDS/MEDIUM_BRANDS_SEARCH_ERROR';

/* search on all characters of a specific medium */
export function searchMediumBrands (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumBrands({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_BRANDS_SEARCH_ERROR });
    }
  };
}
