import { del, get, post, postFormData } from './request';
import { transformBroadcastChannel } from './transformers';

export async function searchBroadcastChannels (baseUrl, authenticationToken, locale, { searchString }) {
  let searchUrl = `${baseUrl}/v004/media/broadcastChannels?pageSize=25`;
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

export async function fetchBroadcastChannel (baseUrl, authenticationToken, locale, { broadcastChannelId }) {
  const url = `${baseUrl}/v004/media/broadcastChannels/${broadcastChannelId}`;
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
  const result = await post(authenticationToken, locale, url, { ...bc, uuid: id, name });
  return transformBroadcastChannel(result.body);
}

export async function deleteBroadcastChannel (baseUrl, authenticationToken, locale, { broadcastChannelId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/broadcastChannels/${broadcastChannelId}`);
}

export async function deleteBroadcastChannels (baseUrl, authenticationToken, locale, { broadcastChannelIds }) {
  for (const broadcastChannelId of broadcastChannelIds) {
    await deleteBroadcastChannel(baseUrl, authenticationToken, locale, { broadcastChannelId });
  }
}

export async function uploadBroadcastChannelImage (baseUrl, authenticationToken, locale, { broadcastChannelId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/broadcastChannels/${broadcastChannelId}/logo`, formData, callback);
  return transformBroadcastChannel(result.body);
}

export async function deleteLogo (baseUrl, authenticationToken, locale, { broadcastChannelId }) {
  const url = `${baseUrl}/v004/media/broadcastChannels/${broadcastChannelId}/logo`;
  return await del(authenticationToken, locale, url);
}
