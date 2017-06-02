import { fetchDatalabeltype as dataFetchDatalabeltype } from '../../../../actions/datalabeltype';

export const DATALABELTYPE_FETCH_ENTRY_ERROR = 'DATALABELTYPES_READ/FETCH_ENTRY_ERROR';

export function loadDatalabeltype (datalabeltypeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchDatalabeltype({ datalabeltypeId }));
    } catch (error) {
      dispatch({ error, type: DATALABELTYPE_FETCH_ENTRY_ERROR });
    }
  };
}
