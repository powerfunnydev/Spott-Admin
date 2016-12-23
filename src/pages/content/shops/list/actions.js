import { fetchShops as dataFetchShops,
  deleteShop as dataDeleteShop,
  deleteShops as dataDeleteShops } from '../../../../actions/shop';

// Action types
// ////////////

export const SHOP_FETCH_START = 'SHOPS/SHOP_FETCH_START';
export const SHOP_FETCH_ERROR = 'SHOPS/SHOP_FETCH_ERROR';

export const SHOPS_DELETE_ERROR = 'SHOPS/SHOPS_REMOVE_ERROR';
export const SHOP_DELETE_ERROR = 'SHOPS/SHOP_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'SHOPS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SHOPS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'SHOPS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchShops(query));
    } catch (error) {
      dispatch({ error, type: SHOP_FETCH_ERROR });
    }
  };
}

export function deleteShops (shopIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteShops({ shopIds }));
    } catch (error) {
      dispatch({ error, type: SHOPS_DELETE_ERROR });
    }
  };
}

export function deleteShop (shopId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteShop({ shopId }));
    } catch (error) {
      dispatch({ error, type: SHOP_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
