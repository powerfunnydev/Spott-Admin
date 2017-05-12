import { searchBrands as dataSearchBrands } from '../../../../actions/brand';

import {
  fetchCommercials as dataFetchCommercials,
  deleteCommercial as dataDeleteCommercial,
  deleteCommercials as dataDeleteCommercials
} from '../../../../actions/commercial';

// Action types
// ////////////
export const BRANDS_SEARCH_START = 'COMMERCIALS/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'COMMERCIALS/BRANDS_SEARCH_ERROR';

export const COMMERCIALS_FETCH_START = 'COMMERCIALS/COMMERCIALS_FETCH_START';
export const COMMERCIALS_FETCH_ERROR = 'COMMERCIALS/COMMERCIALS_FETCH_ERROR';

export const COMMERCIALS_DELETE_ERROR = 'COMMERCIALS/COMMERCIALS_REMOVE_ERROR';
export const COMMERCIAL_DELETE_ERROR = 'COMMERCIALS/COMMERCIAL_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'COMMERCIALS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'COMMERCIALS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'COMMERCIALS/SORT_COLUMN';

export { fetchBrand } from '../../../../actions/brand';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCommercials(query));
    } catch (error) {
      dispatch({ error, type: COMMERCIALS_FETCH_ERROR });
    }
  };
}

export function deleteCommercials (commercialIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteCommercials({ commercialIds }));
    } catch (error) {
      dispatch({ error, type: COMMERCIALS_DELETE_ERROR });
    }
  };
}

export function deleteCommercial (commercialId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteCommercial({ commercialId }));
    } catch (error) {
      dispatch({ error, type: COMMERCIAL_DELETE_ERROR });
    }
  };
}

export function searchBrands (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: BRANDS_SEARCH_START, searchString });
      return await dispatch(dataSearchBrands({ searchString }));
    } catch (error) {
      dispatch({ error, type: BRANDS_SEARCH_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
