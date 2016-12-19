import { persistCommercial } from '../../../../actions/commercial';
import { searchBrands as dataSearchBrands } from '../../../../actions/brand';

export { load as loadCommercials } from '../list/actions';

export const BRANDS_SEARCH_START = 'COMMERCIAL_CREATE/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'COMMERCIAL_CREATE/BRANDS_SEARCH_ERROR';

export const COMMERCIAL_PERSIST_ERROR = 'COMMERCIAL_CREATE/COMMERCIAL_PERSIST_ERROR';

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

export function submit ({ defaultLocale, title, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const commercial = {
        ...restProps,
        basedOnDefaultLocale: { [defaultLocale]: true },
        defaultLocale,
        locales: [ defaultLocale ],
        title: { [defaultLocale]: title }
      };
      return await dispatch(persistCommercial(commercial));
    } catch (error) {
      dispatch({ error, type: COMMERCIAL_PERSIST_ERROR });
    }
  };
}
