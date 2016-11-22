import { del, get, post } from './request';
import { transformSeriesEntry, transformSeriesEntry004, transformListSeason } from './transformers';

export async function fetchSeriesEntrySeasons (baseUrl, authenticationToken, locale, { seriesEntryId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/series/${seriesEntryId}/seasons?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListSeason);
  return body;
}

export async function fetchSeriesEntries (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/series?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformSeriesEntry);
  return body;
}

export async function fetchSeriesEntry (baseUrl, authenticationToken, locale, { seriesEntryId }) {
  const url = `${baseUrl}/v004/media/series/${seriesEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformSeriesEntry004(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistSeriesEntry (baseUrl, authenticationToken, locale, { id, title }) {
  let seriesEntry = {};
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/series/${id}`);
    // console.log('body', body);
    seriesEntry = body;
  }
  const url = `${baseUrl}/v004/media/series`;
  await post(authenticationToken, locale, url, { ...seriesEntry, uuid: id, defaultLocale: 'nl' });
}

export async function deleteSeriesEntry (baseUrl, authenticationToken, locale, { seriesEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/series/${seriesEntryId}`);
}

export async function deleteSeriesEntries (baseUrl, authenticationToken, locale, { seriesEntryIds }) {
  for (const seriesEntryId of seriesEntryIds) {
    await deleteSeriesEntry(baseUrl, authenticationToken, locale, { seriesEntryId });
  }
}

// Used for autocompletion.
export async function searchSeriesEntries (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/series?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformSeriesEntry);
}

export async function searchSeasons (baseUrl, authenticationToken, locale, { searchString, seriesEntryId }) {
  console.log('seriesEntryId', seriesEntryId);
  if (!seriesEntryId) {
    return [];
  }
  let searchUrl = `${baseUrl}/v004/media/series/${seriesEntryId}/seasons?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  console.log('url', searchUrl);
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformListSeason);
}
