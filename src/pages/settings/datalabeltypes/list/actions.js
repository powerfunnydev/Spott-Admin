import { fetchDatalabeltypes as dataFetchDatalabeltypes,
    deleteDatalabeltype as dataDeleteDatalabeltype,
    deleteDatalabeltypes as dataDeleteDatalabeltypes,
    fetchAllDatalabeltypes as dataFetchAllDatalabeltypes } from '../../../../actions/datalabeltype';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const DATALABELTYPES_FETCH_START = 'DATALABELTYPES/DATALABELTYPES_FETCH_START';
export const DATALABELTYPES_FETCH_ERROR = 'DATALABELTYPES/DATALABELTYPES_FETCH_ERROR';

export const DATALABELTYPES_DELETE_ERROR = 'DATALABELTYPES/DATALABELTYPES_REMOVE_ERROR';
export const DATALABELTYPE_DELETE_ERROR = 'DATALABELTYPES/DATALABELTYPES_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'DATALABELTYPE/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'DATALABELTYPE/SELECT_CHECKBOX';

export const SORT_COLUMN = 'DATALABELTYPE/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchDatalabeltypes(getInformationFromQuery(query, prefix)));
    } catch (error) {
      dispatch({ error, type: DATALABELTYPES_FETCH_ERROR });
    }
  };
}

export function loadAll () {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchAllDatalabeltypes());
    } catch (error) {
      dispatch({ error, type: DATALABELTYPES_FETCH_ERROR });
    }
  };
}

export function deleteDatalabeltypes (datalabeltypeIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteDatalabeltypes({ datalabeltypeIds }));
    } catch (error) {
      dispatch({ error, type: DATALABELTYPES_DELETE_ERROR });
    }
  };
}

export function deleteDatalabeltype (datalabeltypeId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteDatalabeltype({ datalabeltypeId }));
    } catch (error) {
      dispatch({ error, type: DATALABELTYPE_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
