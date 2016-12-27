import { fetchShop as dataFetchShop } from '../../../../actions/shop';

export const SHOP_FETCH_ERROR = 'SHOP_READ/FETCH_SHOP_ERROR';

export function loadShop (shopId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchShop({ shopId }));
    } catch (error) {
      dispatch({ error, type: SHOP_FETCH_ERROR });
    }
  };
}
