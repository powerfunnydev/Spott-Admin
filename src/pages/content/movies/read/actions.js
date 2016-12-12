import { fetchMovie as dataFetchMovie } from '../../../../actions/movie';

export const MOVIE_FETCH_ERROR = 'MOVIE_READ/FETCH_MOVIE_ERROR';

export function loadMovie (movieId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchMovie({ movieId }));
    } catch (error) {
      dispatch({ error, type: MOVIE_FETCH_ERROR });
    }
  };
}
