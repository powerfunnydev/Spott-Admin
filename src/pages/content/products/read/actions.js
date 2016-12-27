import { fetchProduct as dataFetchProduct } from '../../../../actions/product';

export const PRODUCT_FETCH_ERROR = 'PRODUCT_READ/FETCH_PRODUCT_ERROR';

export function loadProduct (productId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchProduct({ productId }));
    } catch (error) {
      dispatch({ error, type: PRODUCT_FETCH_ERROR });
    }
  };
}
