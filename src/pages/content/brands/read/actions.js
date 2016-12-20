import { fetchBrand as dataFetchBrand } from '../../../../actions/brand';

export const BRAND_FETCH_ERROR = 'BRAND_READ/FETCH_BRAND_ERROR';

export function loadBrand (brandId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchBrand({ brandId }));
    } catch (error) {
      dispatch({ error, type: BRAND_FETCH_ERROR });
    }
  };
}
