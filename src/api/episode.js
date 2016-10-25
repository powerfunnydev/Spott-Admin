import * as request from './request';
import { transformEpisode } from './transformers';

export async function searchEpisodes (baseUrl, authenticationToken, locale, { searchString, seasonId }) {
  if (!seasonId) {
    return [];
  }
  let searchUrl = `${baseUrl}/v003/media/serieSeasons/${seasonId}/episodes?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await request.get(authenticationToken, locale, searchUrl);
  return data.map(transformEpisode);
}
