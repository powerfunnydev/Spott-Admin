import { fetchCommercial as dataFetchCommercial } from '../../../../actions/commercial';

export const COMMERCIAL_FETCH_ERROR = 'COMMERCIAL_READ/FETCH_ENTRY_ERROR';

export function loadCommercial (commercialId) {
  return async (dispatch) => {
    try {
      return await dispatch(dataFetchCommercial({ commercialId }));
    } catch (error) {
      dispatch({ error, type: COMMERCIAL_FETCH_ERROR });
    }
  };
}
