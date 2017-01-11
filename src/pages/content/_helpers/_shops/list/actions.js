import { searchMediumShops as dataSearchMediumShops } from '../../../../../actions/shop';

export { persistMediumShop, deleteMediumShop } from '../../../../../actions/shop';
export const MEDIUM_SHOPS_SEARCH_ERROR = 'HELPERS_SHOPS/MEDIUM_SHOPS_SEARCH_ERROR';

/* search on all characters of a specific medium */
export function searchMediumShops (mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataSearchMediumShops({ mediumId }));
    } catch (error) {
      dispatch({ error, type: MEDIUM_SHOPS_SEARCH_ERROR });
    }
  };
}
