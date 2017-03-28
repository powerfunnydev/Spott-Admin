import { fetchSpott as dataFetchSpott } from '../../../../actions/spott';

export const SPOTT_FETCH_ERROR = 'SPOTT_READ/FETCH_SPOTT_ERROR';

export function loadSpott (spottId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchSpott({ spottId }));
    } catch (error) {
      dispatch({ error, type: SPOTT_FETCH_ERROR });
    }
  };
}
