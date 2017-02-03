// import { del, get, post, postFormData } from './request';
// import { transformListMovie, transformMovie } from './transformers';
import { del, get } from './request';
import { transformPushNotification } from './transformers';

export async function fetchPushNotifications (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/push/messages?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformPushNotification);
  return body;
}

export async function deletePushNotification (baseUrl, authenticationToken, locale, { pushNotificationId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/actors/${pushNotificationId}`);
}

export async function deletePushNotifications (baseUrl, authenticationToken, locale, { pushNotificationsIds }) {
  for (const pushNotificationId of pushNotificationsIds) {
    await deletePushNotification(baseUrl, authenticationToken, locale, { pushNotificationId });
  }
}
