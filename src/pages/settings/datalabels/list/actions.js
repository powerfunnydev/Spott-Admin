import { fetchDatalabels as dataFetchDatalabels,
    deleteDatalabel as dataDeleteDatalabel,
    deleteDatalabels as dataDeleteDatalabels } from '../../../../actions/datalabel';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const DATALABELS_FETCH_START = 'DATALABELS/DATALABELS_FETCH_START';
export const DATALABELS_FETCH_ERROR = 'DATALABELS/DATALABELS_FETCH_ERROR';

export const DATALABELS_DELETE_ERROR = 'DATALABELS/DATALABELS_REMOVE_ERROR';
export const DATALABEL_DELETE_ERROR = 'DATALABELS/DATALABELS_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'DATALABEL/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'DATALABEL/SELECT_CHECKBOX';

export const SORT_COLUMN = 'DATALABEL/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchDatalabels(getInformationFromQuery(query, prefix)));
    } catch (error) {
      dispatch({ error, type: DATALABELS_FETCH_ERROR });
    }
  };
}

export function deleteDatalabels (datalabelIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteDatalabels({ datalabelIds }));
    } catch (error) {
      dispatch({ error, type: DATALABELS_DELETE_ERROR });
    }
  };
}

export function deleteDatalabel (datalabelId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteDatalabel({ datalabelId }));
    } catch (error) {
      dispatch({ error, type: DATALABEL_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
