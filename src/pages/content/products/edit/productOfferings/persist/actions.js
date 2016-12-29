import { searchShops as dataSearchShops } from '../../../../../../actions/shop';

export const SHOPS_SEARCH_START = 'PRODUCT_OFFERINGS_PERSIST/SHOPS_SEARCH_START';
export const SHOPS_SEARCH_ERROR = 'PRODUCT_OFFERINGS_PERSIST/SHOPS_SEARCH_ERROR';

export function searchShops (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: SHOPS_SEARCH_START, searchString });
      return await dispatch(dataSearchShops({ searchString }));
    } catch (error) {
      dispatch({ error, type: SHOPS_SEARCH_ERROR });
    }
  };
}
