import { persistProduct, fetchProduct as dataFetchProduct } from '../../../../actions/product';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';
import { searchTags as dataSearchTags } from '../../../../actions/tag';
import { searchProductCategories as dataSearchProductCategories } from '../../../../actions/productCategory';

export { deleteImage, uploadImage } from '../../../../actions/product';
export const PRODUCT_FETCH_ENTRY_ERROR = 'PRODUCTS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'PRODUCTS_EDIT/CLOSE_POP_UP_MESSAGE';

export const PRODUCT_PERSIST_ERROR = 'PRODUCTS_EDIT/PRODUCT_PERSIST_ERROR';

export const BRANDS_SEARCH_START = 'PRODUCTS_EDIT/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'PRODUCTS_EDIT/BRANDS_SEARCH_ERROR';

export const TAGS_SEARCH_START = 'PRODUCTS_EDIT/TAGS_SEARCH_START';
export const TAGS_SEARCH_ERROR = 'PRODUCTS_EDIT/TAGS_SEARCH_ERROR';

export const PRODUCT_CATEGORIES_SEARCH_START = 'PRODUCTS_EDIT/PRODUCT_CATEGORIES_SEARCH_START';
export const PRODUCT_CATEGORIES_SEARCH_ERROR = 'PRODUCTS_EDIT/PRODUCT_CATEGORIES_SEARCH_ERROR';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistProduct;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadProduct (productId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchProduct({ productId }));
    } catch (error) {
      dispatch({ error, type: PRODUCT_FETCH_ENTRY_ERROR });
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

export function searchTags (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: TAGS_SEARCH_START, searchString });
      return await dispatch(dataSearchTags({ searchString }));
    } catch (error) {
      dispatch({ error, type: TAGS_SEARCH_ERROR });
    }
  };
}

export function searchProductCategories (searchString) {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: PRODUCT_CATEGORIES_SEARCH_START, searchString });
      return await dispatch(dataSearchProductCategories({ searchString }));
    } catch (error) {
      dispatch({ error, type: PRODUCT_CATEGORIES_SEARCH_ERROR });
    }
  };
}
