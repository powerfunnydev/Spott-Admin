import { del, get, post, postFormData } from './request';
import { transformListMovie, transformMovie } from './transformers';

export async function fetchMovies (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/movies/?page=${page}&pageSize=${pageSize}`;
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
  const url = `${baseUrl}/v004/media/movies//${movieId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformMovie(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistMovie (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, defaultTitle, description, endYear, locales, publishStatus,
  movieId, startYear, title }) {
  let seriesEntry = {};
  if (movieId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/movies//${movieId}`);
    seriesEntry = body;
  }

  // series.categories = mediumCategories.map((mediumCategoryId) => ({ uuid: mediumCategoryId }));
  seriesEntry.defaultLocale = defaultLocale;
  seriesEntry.defaultTitle = title[defaultLocale];
  // series.externalReference.reference = externalReference;
  // series.externalReference.source = externalReferenceSource;
  seriesEntry.publishStatus = publishStatus;

  // Update locale data.
  seriesEntry.localeData = seriesEntry.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    // Get localeData, create if necessary in O(n^2)
    let localeData = seriesEntry.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      seriesEntry.localeData.push(localeData);
    }
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    localeData.endYear = endYear && endYear[locale];
    localeData.startYear = startYear && startYear[locale];
    // title is always provided, no check needed
    localeData.title = title[locale];
  });
  const url = `${baseUrl}/v004/media/movies/`;
  const result = await post(authenticationToken, locale, url, seriesEntry);
  return transformMovie(result.body);
}

export async function deleteMovie (baseUrl, authenticationToken, locale, { movieId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/movies//${movieId}`);
}

export async function deleteMovies (baseUrl, authenticationToken, locale, { movieIds }) {
  for (const movieId of movieIds) {
    await deleteMovie(baseUrl, authenticationToken, locale, { movieId });
  }
}

// Used for autocompletion.
export async function searchMovies (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/movies/?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformListMovie);
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { movieId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${movieId}/profileCover`, formData, callback);
}

export async function uploadPosterImage (baseUrl, authenticationToken, locale, { movieId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${movieId}/posterImage`, formData, callback);
}
