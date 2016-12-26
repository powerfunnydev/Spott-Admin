import { persistProduct } from '../../../../actions/product';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';

export const PRODUCT_PERSIST_ERROR = 'PRODUCT_CREATE/PRODUCT_PERSIST_ERROR';

export const BRANDS_SEARCH_START = 'PRODUCT_CREATE/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'PRODUCT_CREATE/BRANDS_SEARCH_ERROR';

export function submit ({ defaultLocale, shortName, fullName, url, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const product = {
        ...restProps,
        shortName: { [defaultLocale]: shortName },
        fullName: { [defaultLocale]: fullName },
        url: { [defaultLocale]: url },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistProduct(product));
    } catch (error) {
      dispatch({ error, type: PRODUCT_PERSIST_ERROR });
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
