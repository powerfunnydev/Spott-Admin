import { del, get, post } from './request';
import { transformBroadcaster, transformBroadcastChannel } from './transformers';


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

export async function fetchBroadcasterChannels (baseUrl, authenticationToken, locale, { broadcastersEntryId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcasters/${broadcastersEntryId}/channels?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  console.log('url', url);
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformBroadcastChannel);
  return body;
}

export async function fetchBroadcasterEntry (baseUrl, authenticationToken, locale, { broadcastersEntryId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcastersEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformBroadcaster(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistBroadcaster (baseUrl, authenticationToken, locale, { id, name }) {
  let broadcaster;
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${id}`);
    broadcaster = body;
    // console.log('body', body);
  }
  const url = `${baseUrl}/v004/media/broadcasters`;
  await post(authenticationToken, locale, url, { ...broadcaster, uuid: id, name });
}

export async function deleteBroadcasterEntry (baseUrl, authenticationToken, locale, { broadcastersEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${broadcastersEntryId}`);
}

export async function deleteBroadcasterEntries (baseUrl, authenticationToken, locale, { broadcastersEntryIds }) {
  for (const broadcastersEntryId of broadcastersEntryIds) {
    await deleteBroadcasterEntry(baseUrl, authenticationToken, locale, { broadcastersEntryId });
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
