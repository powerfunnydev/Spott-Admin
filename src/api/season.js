import * as request from './request';
import { transformSeason } from './transformers';

export async function searchSeasons (baseUrl, authenticationToken, locale, { searchString, seriesId }) {
  if (!seriesId) {
    return [];
  }
  let searchUrl = `${baseUrl}/v003/media/series/${seriesId}/seasons?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await request.get(authenticationToken, locale, searchUrl);
  return data.map(transformSeason);
}
