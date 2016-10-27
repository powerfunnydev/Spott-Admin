import { del, get, post } from './request';
import { transformBroadcaster } from './transformers';


export async function fetchBroadcasters (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcasters?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformBroadcaster);
  return body;
}

export async function fetchBroadcastersEntry (baseUrl, authenticationToken, locale, { broadcastersEntryId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcastersEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformBroadcaster(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistBroadcasters (baseUrl, authenticationToken, locale, { id, name }) {
  console.log('name', name);
  const url = `${baseUrl}/v004/media/broadcasters`;
  await post(authenticationToken, locale, url, { uuid: id, name });
}

export async function deleteBroadcastersEntry (baseUrl, authenticationToken, locale, { broadcastersEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${broadcastersEntryId}`);
}

export async function deleteBroadcastersEntries (baseUrl, authenticationToken, locale, { broadcastersEntryIds }) {
  for (const broadcastersEntryId of broadcastersEntryIds) {
    await deleteBroadcastersEntry(baseUrl, authenticationToken, locale, { broadcastersEntryId });
  }
}

export async function searchBroadcasters (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/broadcasters?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformBroadcaster);
}
