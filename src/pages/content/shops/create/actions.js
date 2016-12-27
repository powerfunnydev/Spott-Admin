import { persistShop } from '../../../../actions/shop';

export const SHOP_PERSIST_ERROR = 'SHOP_CREATE/SHOP_PERSIST_ERROR';

export function submit ({ defaultLocale, name, url, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const shop = {
        ...restProps,
        name: { [defaultLocale]: name },
        url: { [defaultLocale]: url },
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistShop(shop));
    } catch (error) {
      dispatch({ error, type: SHOP_PERSIST_ERROR });
    }
  };
}
