import {
  fetchProducts as dataFetchProducts,
  deleteProduct as dataDeleteProduct,
  deleteProducts as dataDeleteProducts
} from '../../../../actions/product';

// Action types
// ////////////

export const PRODUCT_FETCH_START = 'PRODUCTS/PRODUCT_FETCH_START';
export const PRODUCT_FETCH_ERROR = 'PRODUCTS/PRODUCT_FETCH_ERROR';

export const PRODUCT_DELETE_ERROR = 'PRODUCTS/PRODUCT_REMOVE_ERROR';
export const PRODUCTS_DELETE_ERROR = 'PRODUCTS/PRODUCTS_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'PRODUCTS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'PRODUCTS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'PRODUCTS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      console.warn('QUERY', query);
      return await dispatch(dataFetchProducts(query));
    } catch (error) {
      dispatch({ error, type: PRODUCT_FETCH_ERROR });
    }
  };
}

export function deleteProducts (productIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteProducts({ productIds }));
    } catch (error) {
      dispatch({ error, type: PRODUCTS_DELETE_ERROR });
    }
  };
}

export function deleteProduct (productId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteProduct({ productId }));
    } catch (error) {
      dispatch({ error, type: PRODUCT_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
