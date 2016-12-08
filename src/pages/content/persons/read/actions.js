import { fetchPerson as dataFetchPerson } from '../../../../actions/person';

export const PERSON_FETCH_ERROR = 'PERSON_READ/FETCH_PERSON_ERROR';

export function loadPerson (personId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchPerson({ personId }));
    } catch (error) {
      dispatch({ error, type: PERSON_FETCH_ERROR });
    }
  };
}
