import { fetchMovies as dataFetchMovies,
  deleteMovie as dataDeleteMovie,
  deleteMovies as dataDeleteMovies } from '../../../../actions/movie';

// Action types
// ////////////

export const MOVIE_FETCH_START = 'MOVIES/MOVIE_FETCH_START';
export const MOVIE_FETCH_ERROR = 'MOVIES/MOVIE_FETCH_ERROR';

export const MOVIES_DELETE_ERROR = 'MOVIES/MOVIES_REMOVE_ERROR';
export const MOVIE_DELETE_ERROR = 'MOVIES/MOVIE_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'MOVIES/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'MOVIES/SELECT_CHECKBOX';

export const SORT_COLUMN = 'MOVIES/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchMovies(query));
    } catch (error) {
      dispatch({ error, type: MOVIE_FETCH_ERROR });
    }
  };
}

export function deleteMovies (movieIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteMovies({ movieIds }));
    } catch (error) {
      dispatch({ error, type: MOVIES_DELETE_ERROR });
    }
  };
}

export function deleteMovie (movieId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataDeleteMovie({ movieId }));
    } catch (error) {
      dispatch({ error, type: MOVIE_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
