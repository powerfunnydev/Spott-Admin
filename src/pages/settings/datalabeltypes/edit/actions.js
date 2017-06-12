import { persistDatalabeltype, fetchDatalabeltype as dataFetchDatalabeltype } from '../../../../actions/datalabeltype';

export const DATALABELTYPES_FETCH_ENTRY_ERROR = 'DATALABELTYPES_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'DATALABELTYPES_EDIT/CLOSE_POP_UP_MESSAGE';
export { openModal, closeModal } from '../../../../actions/global';

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

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

