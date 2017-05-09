import { deleteSpott as dataDeleteSpott,
  deleteSpotts as dataDeleteSpotts } from '../../../actions/spott';
import { fetchSpotts as dataFetchSpotts } from '../../../actions/topic';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { prefix } from './index';

// Action types
// ////////////

export const SPOTTS_FETCH_ERROR = 'TOPIC_SPOTTS/SPOTTS_FETCH_ERROR';

export const SPOTTS_DELETE_ERROR = 'TOPIC_SPOTTS/SPOTTS_REMOVE_ERROR';
export const SPOTTS_ENTRY_DELETE_ERROR = 'TOPIC_SPOTTS/SPOTTS_ENTRY_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'TOPIC_SPOTTS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'TOPIC_SPOTTS/SELECT_CHECKBOX';
export const SELECT_ENTITY = 'TOPIC_SPOTTS/SELECT_ENTITY';

export const SORT_COLUMN = 'TOPIC_SPOTTS/SORT_COLUMN';

export function load (query, topicId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSpotts({ ...getInformationFromQuery(query, prefix), topicId }));
    } catch (error) {
      dispatch({ error, type: SPOTTS_FETCH_ERROR });
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
      dispatch({ error, type: SPOTTS_ENTRY_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes (topicId) {
  return { type: SELECT_ALL_CHECKBOXES, topicId };
}

export function selectCheckbox (id, topicId) {
  return { type: SELECT_CHECKBOX, id, topicId };
}

export function selectEntity (id, topicId) {
  return { type: SELECT_ENTITY, id, topicId };
}
