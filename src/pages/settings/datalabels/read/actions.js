import { fetchDatalabel as dataFetchDatalabel } from '../../../../actions/datalabel';

export const DATALABEL_FETCH_ENTRY_ERROR = 'DATALABELS_READ/FETCH_ENTRY_ERROR';

export function loadDatalabel (datalabelId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchDatalabel({ datalabelId }));
    } catch (error) {
      dispatch({ error, type: DATALABEL_FETCH_ENTRY_ERROR });
    }
  };
}
