import { del, get, post, postFormData } from './request';
import { transformUser, transformBroadcaster, transformBroadcastChannel } from './transformers';

export async function fetchBroadcasterUsers (baseUrl, authenticationToken, locale, { broadcasterId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/users?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformUser);
  return body;
}

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
  return transformBroadcaster(body);
}

export async function persistBroadcaster (baseUrl, authenticationToken, locale, { id, name }) {
  let broadcaster;
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${id}`);
    broadcaster = body;
  }
  const url = `${baseUrl}/v004/media/broadcasters`;
  const result = await post(authenticationToken, locale, url, { ...broadcaster, uuid: id, name });
  return transformBroadcaster(result.body);
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

export async function persistLinkUser (baseUrl, authenticationToken, locale, { broadcasterId, userId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/users/${userId}`;
  return await post(authenticationToken, locale, url);
}

export async function deleteLinkUser (baseUrl, authenticationToken, locale, { broadcasterId, userId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/users/${userId}`;
  return await del(authenticationToken, locale, url);
}

export async function deleteLinkUsers (baseUrl, authenticationToken, locale, { broadcasterId, userIds }) {
  for (const userId of userIds) {
    await deleteLinkUser(baseUrl, authenticationToken, locale, { broadcasterId, userId });
  }
}

export async function uploadBroadcasterImage (baseUrl, authenticationToken, locale, { broadcasterId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${broadcasterId}/logo`, formData, callback);
  return transformBroadcaster(result.body);
}

export async function deleteLogo (baseUrl, authenticationToken, locale, { broadcasterId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/logo`;
  return await del(authenticationToken, locale, url);
}
