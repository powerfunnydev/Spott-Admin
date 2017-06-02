import { persistDatalabeltype, fetchDatalabeltype as dataFetchDatalabeltype } from '../../../../actions/datalabeltype';

export const DATALABELTYPES_FETCH_ENTRY_ERROR = 'DATALABELTYPES_EDIT/FETCH_ENTRY_ERROR';

export const submit = persistDatalabeltype;

export function load (datalabeltypeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchDatalabeltype({ datalabeltypeId }));
    } catch (error) {
      dispatch({ error, type: DATALABELTYPES_FETCH_ENTRY_ERROR });
    }
  };
}
