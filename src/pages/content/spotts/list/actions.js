import {
  fetchSpotts as dataFetchSpotts,
  deleteSpott as dataDeleteSpott,
  deleteSpotts as dataDeleteSpotts
} from '../../../../actions/spott';

// Action types
// ////////////

export const SPOTT_FETCH_START = 'SPOTTS/SPOTT_FETCH_START';
export const SPOTT_FETCH_ERROR = 'SPOTTS/SPOTT_FETCH_ERROR';

export const SPOTTS_DELETE_ERROR = 'SPOTTS/SPOTTS_REMOVE_ERROR';
export const SPOTT_DELETE_ERROR = 'SPOTTS/SPOTT_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'SPOTTS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SPOTTS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'SPOTTS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSpotts(query));
    } catch (error) {
      dispatch({ error, type: SPOTT_FETCH_ERROR });
    }
  };
}

export function deleteSpotts (spottIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteSpotts({ spottIds }));
    } catch (error) {
      dispatch({ error, type: SPOTTS_DELETE_ERROR });
    }
  };
}

export function deleteSpott (spottId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteSpott({ spottId }));
    } catch (error) {
      dispatch({ error, type: SPOTT_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
