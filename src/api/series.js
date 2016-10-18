import * as request from './request';
import { transformSeries } from './transformers';

/**
 * GET /media/series?searchString=...
 * Search for series.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.searchString=''] The string to search products on.
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function searchSeries (authenticationToken, locale, { searchString = '' }) {
  let searchUrl = '/v003/media/series?pageSize=30';
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await request.get(authenticationToken, locale, searchUrl);
  return data.map(transformSeries);
}
