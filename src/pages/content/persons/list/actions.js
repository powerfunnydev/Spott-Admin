import { fetchPersons as dataFetchPersons,
  deletePerson as dataDeletePerson,
  deletePersons as dataDeletePersons } from '../../../../actions/person';

// Action types
// ////////////

export const PERSON_FETCH_START = 'PERSONS/PERSON_FETCH_START';
export const PERSON_FETCH_ERROR = 'PERSONS/PERSON_FETCH_ERROR';

export const PERSONS_DELETE_ERROR = 'PERSONS/PERSONS_REMOVE_ERROR';
export const PERSON_DELETE_ERROR = 'PERSONS/PERSON_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'PERSONS/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'PERSONS/SELECT_CHECKBOX';

export const SORT_COLUMN = 'PERSONS/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchPersons(query));
    } catch (error) {
      dispatch({ error, type: PERSON_FETCH_ERROR });
    }
  };
}

export function deletePersons (personIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeletePersons({ personIds }));
    } catch (error) {
      dispatch({ error, type: PERSONS_DELETE_ERROR });
    }
  };
}

export function deletePerson (personId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeletePerson({ personId }));
    } catch (error) {
      dispatch({ error, type: PERSON_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
