import { fetchBrands as dataFetchBrands,
  deleteBrand as dataDeleteBrand,
  deleteBrands as dataDeleteBrands } from '../../../../actions/brand';

// Action types
// ////////////

export const BRAND_FETCH_START = 'BRANDS/BRAND_FETCH_START';
export const BRAND_FETCH_ERROR = 'BRANDS/BRAND_FETCH_ERROR';

export const BRANDS_DELETE_ERROR = 'BRANDS/BRANDS_REMOVE_ERROR';
export const BRAND_DELETE_ERROR = 'BRANDS/BRAND_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BRANDS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BRANDS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'BRANDS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBrands(query));
    } catch (error) {
      dispatch({ error, type: BRAND_FETCH_ERROR });
    }
  };
}

export function deleteBrands (brandIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBrands({ brandIds }));
    } catch (error) {
      dispatch({ error, type: BRANDS_DELETE_ERROR });
    }
  };
}

export function deleteBrand (brandId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBrand({ brandId }));
    } catch (error) {
      dispatch({ error, type: BRAND_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
