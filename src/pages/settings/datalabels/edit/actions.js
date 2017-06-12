import { persistDatalabel, fetchDatalabel as dataFetchDatalabel } from '../../../../actions/datalabel';

export const DATALABELS_FETCH_ENTRY_ERROR = 'DATALABELS_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'DATALABELS_EDIT/CLOSE_POP_UP_MESSAGE';
export { openModal, closeModal } from '../../../../actions/global';

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

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}
