import { deleteCrop as dataDeleteCrop,
  deleteCrops as dataDeleteCrops } from '../../../actions/crop';
import { fetchCrops as dataFetchCrops } from '../../../actions/media';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const CROPS_FETCH_ERROR = 'MEDIUM_CROPS/CROPS_FETCH_ERROR';

export const CROPS_DELETE_ERROR = 'MEDIUM_CROPS/CROPS_REMOVE_ERROR';
export const CROPS_ENTRY_DELETE_ERROR = 'MEDIUM_CROPS/CROPS_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'MEDIUM_SPOTTS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'MEDIUM_SPOTTS/SELECT_CHECKBOX';
export const SELECT_ENTITY = 'MEDIUM_SPOTTS/SELECT_ENTITY';

export const SORT_COLUMN = 'MEDIUM_SPOTTS/SORT_COLUMN';

export function load (query, mediumId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchCrops({ ...getInformationFromQuery(query, prefix), mediumId }));
    } catch (error) {
      dispatch({ error, type: CROPS_FETCH_ERROR });
    }
  };
}

export function deleteCrops (cropIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteCrops({ cropIds }));
    } catch (error) {
      dispatch({ error, type: CROPS_DELETE_ERROR });
    }
  };
}

export function deleteCrop (cropId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteCrop({ cropId }));
    } catch (error) {
      dispatch({ error, type: CROPS_ENTRY_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes (mediumId) {
  return { type: SELECT_ALL_CHECKBOXES, mediumId };
}

export function selectCheckbox (id, mediumId) {
  return { type: SELECT_CHECKBOX, id, mediumId };
}

export function selectEntity (id, mediumId) {
  return { type: SELECT_ENTITY, id, mediumId };
}
