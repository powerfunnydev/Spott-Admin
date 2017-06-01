import { del, get, post, postFormData } from './request';
import { transformListMedium, transformUser, transformBroadcaster, transformBroadcastChannel, transformDatalabeltype } from './transformers';

export async function fetchDatalabeltypeUsers (baseUrl, authenticationToken, locale, { broadcasterId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/users?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
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

export async function fetchDatalabeltypes (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/data/labelTypes?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformDatalabeltype);
  return body;
}

export async function fetchBDatalabeltypeChannels (baseUrl, authenticationToken, locale, { broadcasterId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/channels?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
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

export async function fetchDatalabeltype (baseUrl, authenticationToken, locale, { broadcasterId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformBroadcaster(body);
}

export async function persistDatalabeltype (baseUrl, authenticationToken, locale, { id, name }) {
  let broadcaster;
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${id}`);
    broadcaster = body;
  }
  const url = `${baseUrl}/v004/media/broadcasters`;
  const result = await post(authenticationToken, locale, url, { ...broadcaster, uuid: id, name });
  return transformBroadcaster(result.body);
}

export async function deleteDatalabeltype (baseUrl, authenticationToken, locale, { datalabeltypeId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/data/labelTypes/${datalabeltypeId}`);
}

export async function deleteDatalabeltypes (baseUrl, authenticationToken, locale, { datalabeltypeIds }) {
  for (const datalabeltypeId of datalabeltypeIds) {
    await deleteDatalabeltype(baseUrl, authenticationToken, locale, { datalabeltypeId });
  }
}

// Used for autocompletion.
export async function searchDatalabeltypes (baseUrl, authenticationToken, locale, { searchString = '' }) {
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

export async function uploadDatalabeltypeImage (baseUrl, authenticationToken, locale, { broadcasterId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/broadcasters/${broadcasterId}/logo`, formData, callback);
  return transformBroadcaster(result.body);
}

export async function deleteLogo (baseUrl, authenticationToken, locale, { broadcasterId }) {
  const url = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/logo`;
  return await del(authenticationToken, locale, url);
}

export async function searchDatalabeltypeMedia (baseUrl, authenticationToken, locale, { broadcasterId, searchString }) {
  let searchUrl = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/media?page=0&pageSize=25&types=TV_SERIE,MOVIE,COMMERCIAL`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformListMedium);
  return body;
}

export async function searchDatalabeltypeChannels (baseUrl, authenticationToken, locale, { broadcasterId, searchString }) {
  let searchUrl = `${baseUrl}/v004/media/broadcasters/${broadcasterId}/channels?page=0&pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformBroadcastChannel);
  return body;
}
