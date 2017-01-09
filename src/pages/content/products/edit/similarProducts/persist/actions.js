import { searchProducts as dataSearchProducts } from '../../../../../../actions/product';

export const PRODUCTS_SEARCH_START = 'SIMILAR_PRODUCT_PERSIST/PRODUCTS_SEARCH_START';
export const PRODUCTS_SEARCH_ERROR = 'SIMILAR_PRODUCT_PERSIST/PRODUCTS_SEARCH_ERROR';

export function searchProducts (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: PRODUCTS_SEARCH_START, searchString });
      return await dispatch(dataSearchProducts({ searchString }));
    } catch (error) {
      dispatch({ error, type: PRODUCTS_SEARCH_ERROR });
    }
  };
}
