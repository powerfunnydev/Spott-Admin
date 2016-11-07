import { del, get, post, postFormData } from './request';
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

export async function fetchBroadcasterChannels (baseUrl, authenticationToken, locale, { broadcasterId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/channels?page=${page}&pageSize=${pageSize}`;
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

export async function fetchBroadcaster (baseUrl, authenticationToken, locale, { broadcasterId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}`;
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

export async function deleteBroadcaster (baseUrl, authenticationToken, locale, { broadcasterId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${broadcasterId}`);
}

export async function deleteBroadcasters (baseUrl, authenticationToken, locale, { broadcasterIds }) {
  for (const broadcasterId of broadcasterIds) {
    await deleteBroadcaster(baseUrl, authenticationToken, locale, { broadcasterId });
  }
}

// Used for autocompletion.
export async function searchBroadcasters (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/broadcasters?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformBroadcaster);
}

export async function uploadBroadcasterImage (baseUrl, authenticationToken, locale, { broadcasterEntryId, image, callback }) {
  const formData = new FormData();
  formData.append('uuid', broadcasterEntryId);
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${broadcasterEntryId}/logo`, formData, callback);
}
