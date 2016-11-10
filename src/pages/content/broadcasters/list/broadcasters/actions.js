import { fetchBroadcasters as dataFetchBroadcasters,
  deleteBroadcaster as dataDeleteBroadcaster,
  deleteBroadcasters as dataDeleteBroadcasters } from '../../../../../actions/broadcaster';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const BROADCASTERS_FETCH_START = 'BROADCASTERS/BROADCASTERS_FETCH_START';
export const BROADCASTERS_FETCH_ERROR = 'BROADCASTERS/BROADCASTERS_FETCH_ERROR';

export const BROADCASTERS_DELETE_ERROR = 'BROADCASTERS/BROADCASTERS_REMOVE_ERROR';
export const BROADCASTER_DELETE_ERROR = 'BROADCASTERS/BROADCASTER_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'BROADCASTERS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'BROADCASTERS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'BROADCASTERS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      console.log('before query', query);
      console.log('after query', getInformationFromQuery(query, prefix));
      return await dispatch(dataFetchBroadcasters(getInformationFromQuery(query, prefix)));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_FETCH_ERROR });
    }
  };
}

export function deleteBroadcasters (broadcasterIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBroadcasters({ broadcasterIds }));
    } catch (error) {
      dispatch({ error, type: BROADCASTERS_DELETE_ERROR });
    }
  };
}

export function deleteBroadcaster (broadcasterId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteBroadcaster({ broadcasterId }));
    } catch (error) {
      dispatch({ error, type: BROADCASTER_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
