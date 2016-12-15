import { del, get, post, postFormData } from './request';
import { transformListMovie, transformMovie } from './transformers';

export async function fetchMovies (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/movies?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListMovie);
  return body;
}

export async function fetchMovie (baseUrl, authenticationToken, locale, { movieId }) {
  const url = `${baseUrl}/v004/media/movies/${movieId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformMovie(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistMovie (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, broadcasters, characters, contentProducers, defaultLocale,
  defaultTitle, description, endYear, movieId, locales,
  publishStatus, relatedCharacterIds, startYear, title, subTitle, mediumCategories
}) {
  let movie = {};
  if (movieId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/movies/${movieId}`);
    movie = body;
  }
  console.log('title', title);
  movie.categories = mediumCategories && mediumCategories.map((mediumCategoryId) => ({ uuid: mediumCategoryId }));
  movie.contentProducers = contentProducers && contentProducers.map((cp) => ({ uuid: cp }));
  movie.broadcasters = broadcasters && broadcasters.map((bc) => ({ uuid: bc }));
  movie.defaultLocale = defaultLocale;
  movie.defaultTitle = defaultTitle;
  // movie.externalReference.reference = externalReference;
  // movie.externalReference.source = externalReferenceSource;
  movie.publishStatus = publishStatus;
  movie.type = 'MOVIE';
  // Update locale data.
  movie.localeData = [];
  locales.forEach((locale) => {
    // Get localeData, create if necessary in O(n^2)
    const localeData = {};
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    localeData.endYear = endYear && endYear[locale];
    localeData.startYear = startYear && startYear[locale];
    localeData.title = title && title[locale];
    localeData.subTitle = subTitle && subTitle[locale];
    localeData.locale = locale;
    movie.localeData.push(localeData);
  });
  console.log('movie', movie);
  const url = `${baseUrl}/v004/media/movies`;
  const result = await post(authenticationToken, locale, url, movie);
  return transformMovie(result.body);
}

export async function deleteMovie (baseUrl, authenticationToken, locale, { movieId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/movies/${movieId}`);
}

export async function deleteMovies (baseUrl, authenticationToken, locale, { movieIds }) {
  for (const movieId of movieIds) {
    await deleteMovie(baseUrl, authenticationToken, locale, { movieId });
  }
}

// Used for autocompletion.
export async function searchMovies (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/movies?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformListMovie);
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { locale: imageLocale, movieId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${movieId}/profileCover`, formData, callback);
  return transformMovie(result.body);
}

export async function uploadPosterImage (baseUrl, authenticationToken, locale, { locale: imageLocale, movieId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${movieId}/posterImage`, formData, callback);
  return transformMovie(result.body);
}
