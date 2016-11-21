import { del, get, post } from './request';
import { transformSeason004, transformSeason, transformEpisode, transformListEpisode } from './transformers';

export async function fetchSeasonEpisodes (baseUrl, authenticationToken, locale, { seasonId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/serieSeasons/${seasonId}/episodes?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListEpisode);
  return body;
}

export async function searchEpisodes (baseUrl, authenticationToken, locale, { searchString, seasonId }) {
  if (!seasonId) {
    return [];
  }
  let searchUrl = `${baseUrl}/v003/media/serieSeasons/${seasonId}/episodes?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformEpisode);
}

export async function fetchSeasons (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/serieSeasons?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformSeason);
  return body;
}

export async function fetchSeason (baseUrl, authenticationToken, locale, { seasonId }) {
  const url = `${baseUrl}/v004/media/serieSeasons/${seasonId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformSeason004(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistSeason (baseUrl, authenticationToken, locale, { seasonId, name, seriesEntryId }) {
  let cp = {};
  if (seasonId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/serieSeasons/${seasonId}`);
    // console.log('body', body);
    cp = body;
  }
  const url = `${baseUrl}/v004/media/serieSeasons`;
  await post(authenticationToken, locale, url, { ...cp, uuid: seasonId, name, serie: { uuid: seriesEntryId }, defaultLocale: 'en' });
}

export async function deleteSeason (baseUrl, authenticationToken, locale, { seasonId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/serieSeasons/${seasonId}`);
}

export async function deleteSeasons (baseUrl, authenticationToken, locale, { seasonIds }) {
  for (const seasonId of seasonIds) {
    await deleteSeason(baseUrl, authenticationToken, locale, { seasonId });
  }
}
