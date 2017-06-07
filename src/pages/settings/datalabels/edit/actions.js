import { persistDatalabel, fetchDatalabel as dataFetchDatalabel } from '../../../../actions/datalabel';

export const DATALABELS_FETCH_ENTRY_ERROR = 'DATALABELS_EDIT/FETCH_ENTRY_ERROR';

export const submit = persistDatalabel;

export function load (datalabelId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchDatalabel({ datalabelId }));
    } catch (error) {
      dispatch({ error, type: DATALABELS_FETCH_ENTRY_ERROR });
    }
  };
}
