import { persistMovie } from '../../../../actions/movie';

export const MOVIE_PERSIST_ERROR = 'MOVIE_CREATE/MOVIE_PERSIST_ERROR';

export function submit ({ title, defaultLocale }) {
  return async (dispatch, getState) => {
    try {
      const movie = {
        defaultLocale,
        locales: [ defaultLocale ],
        title: { [defaultLocale]: title },
        basedOnDefaultLocale: { [defaultLocale]: true }
      };
      return await dispatch(persistMovie(movie));
    } catch (error) {
      dispatch({ error, type: MOVIE_PERSIST_ERROR });
    }
  };
}
