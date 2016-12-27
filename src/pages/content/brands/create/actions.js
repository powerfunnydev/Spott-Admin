import { persistBrand } from '../../../../actions/brand';

export const BRAND_PERSIST_ERROR = 'BRAND_CREATE/BRAND_PERSIST_ERROR';

export function submit ({ defaultLocale, name, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const brand = {
        ...restProps,
        name: { [defaultLocale]: name },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistBrand(brand));
    } catch (error) {
      dispatch({ error, type: BRAND_PERSIST_ERROR });
    }
  };
}
