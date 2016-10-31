import { del, get, post } from './request';
import { transformBroadcastChannel } from './transformers';

export async function searchBroadcastChannels (baseUrl, authenticationToken, locale, { searchString }) {
  let searchUrl = `${baseUrl}/v004/media/broadcastChannels?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformBroadcastChannel);
}

export async function fetchBroadcastChannels (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcastChannels?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformBroadcastChannel);
  return body;
}

export async function fetchBroadcastChannelEntry (baseUrl, authenticationToken, locale, { broadcastChannelEntryId }) {
  const url = `${baseUrl}/v004/media/broadcastChannels/${broadcastChannelEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformBroadcastChannel(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistBroadcastChannel (baseUrl, authenticationToken, locale, { id, name, broadcasterId }) {
  let bc = {};
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/broadcastChannels/${id}`);
    bc = body;
  }
  const url = `${baseUrl}/v004/media/broadcastChannels`;
  bc.broadcaster = broadcasterId && { uuid: broadcasterId } || bc.broadcaster;
  await post(authenticationToken, locale, url, { ...bc, uuid: id, name });
}

export async function deleteBroadcastChannelEntry (baseUrl, authenticationToken, locale, { broadcastChannelEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/broadcastChannels/${broadcastChannelEntryId}`);
}

export async function deleteBroadcastChannelEntries (baseUrl, authenticationToken, locale, { broadcastChannelEntryIds }) {
  for (const broadcastChannelEntryId of broadcastChannelEntryIds) {
    await deleteBroadcastChannelEntry(baseUrl, authenticationToken, locale, { broadcastChannelEntryId });
  }
}
