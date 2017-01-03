import { fetchProducts as dataFetchProducts } from '../../../../../../actions/brand';
import { deleteProduct as dataDeleteProduct, deleteProducts as dataDeleteProducts } from '../../../../../../actions/product';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const PRODUCTS_FETCH_START = 'BRAND/PRODUCTS_FETCH_START';
export const PRODUCTS_FETCH_ERROR = 'BRAND/PRODUCTS_FETCH_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BRAND/PRODUCTS_SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BRAND/PRODUCTS_SELECT_CHECKBOX';

export const SORT_COLUMN = 'BRAND/PRODUCTS_SORT_COLUMN';

export const PRODUCT_DELETE_ERROR = 'BRAND/PRODUCT_DELETE_ERROR';
export const PRODUCTS_DELETE_ERROR = 'BRAND/PRODUCTS_DELETE_ERROR';

export function deleteProduct (productId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteProduct({ productId }));
    } catch (error) {
      dispatch({ error, type: PRODUCT_DELETE_ERROR });
    }
  };
}

export function load (query, brandId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchProducts({ ...getInformationFromQuery(query, prefix), brandId }));
    } catch (error) {
      dispatch({ error, type: PRODUCTS_FETCH_ERROR });
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

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
