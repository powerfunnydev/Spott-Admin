/* TODO: DEPRECATED! REMOVE THIS CODE. */

/* eslint-disable prefer-const */
import { authenticationTokenSelector } from '../selectors/global';

/**
 * Internal helper, retrieving the authentication token from the state tree.
 */
export function fetchRecordStart (type, args) {
  return { ...args, type };
}
export function fetchRecordSuccess (type, record, args) {
  return { ...args, record, type };
}
export function fetchRecordError (type, error, args) {
  return { ...args, error, type };
}

export const updateRecordStart = fetchRecordStart;
export const updateRecordSuccess = fetchRecordSuccess;
export const updateRecordError = fetchRecordError;

export const deleteRecordStart = fetchRecordStart;
export function deleteRecordSuccess (type, records, args) {
  return { ...args, records, type };
}
export const deleteRecordError = fetchRecordError;

export function createRecordStart (type) {
  return { type };
}
export function createRecordSuccess (type, records, args) {
  return { ...args, records, type };
}
export function createRecordError (type, error) {
  return { error, type };
}

/**
 * Higher order function which creates and returns an action creator for typical
 * fetching of an entity by its unique identifier.
 * @param {function(id: string): Promise<Object, Error>} fetchByIdApiCall
 * @param {string} startActionType The type of the action { id, type} to be triggered before fetching the data.
 * @param {string} successActionType The type of the action { record, id, type} to be triggered when data was succesfully retrieved.
 * @param {string} errorActionType The type of the action { error, id, type} to be triggered in case of failure.
 * @return {function(id: string): Promise<Object, Error>} A function performing the API call by means of invocation of the
 * passed asynchronous function fetchByIdApiCall. An action with action type startActionType
 * is triggered before the actual invocation of the API. On completion of the request,
 * either successActionType or errorActionType is triggered.
 */
export function makeFetchRecordActionCreator (fetchByIdApiCall, stateToArgs, startActionType, successActionType, errorActionType) {
  return function fetch (args = {}) {
    return async (dispatch, getState) => {
      let state = getState();
      // Retrieve the authentication token from te store
      let authenticationToken = authenticationTokenSelector(state);

      // Extend args with properties from the state.
      if (stateToArgs) {
        Object.assign(args, stateToArgs(state));
      }

      // Dispatch an action announcing data fetching
      dispatch(fetchRecordStart(startActionType, args));
      // Try fetching the resource, which can either succeed or fail.
      try {
        let record = await fetchByIdApiCall(authenticationToken, args);
        dispatch(fetchRecordSuccess(successActionType, record, args));
        return record;
      } catch (error) {
        dispatch(fetchRecordError(errorActionType, error, args));
        throw error;
      }
    };
  };
}

export function fetchRecordsStart (type, args) {
  return { ...args, type };
}
export function fetchRecordsSuccess (type, records, args) {
  return { ...args, records, type };
}
export function fetchRecordsError (type, error, args) {
  return { ...args, error, type };
}

export function makeFetchRecordsActionCreator (fetchByIdApiCall, stateToArgs, startActionType, successActionType, errorActionType) {
  return function fetch (args = {}) {
    return async (dispatch, getState) => {
      let state = getState();
      // Retrieve the authentication token from te store
      let authenticationToken = authenticationTokenSelector(state);

      // Extend args with properties from the state.
      if (stateToArgs) {
        Object.assign(args, stateToArgs(state));
      }

      // Dispatch an action announcing data fetching
      dispatch(fetchRecordsStart(startActionType, args));
      // Try fetching the resource, which can either succeed or fail.
      try {
        let records = await fetchByIdApiCall(authenticationToken, args);
        dispatch(fetchRecordsSuccess(successActionType, records, args));
        return records;
      } catch (error) {
        dispatch(fetchRecordsError(errorActionType, error, args));
        throw error;
      }
    };
  };
}
