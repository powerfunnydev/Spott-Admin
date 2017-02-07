// import { del, get, post, postFormData } from './request';
// import { transformListMovie, transformMovie } from './transformers';
import { del, get, post } from './request';
import { transformPushNotification } from './transformers';

export async function fetchPushNotifications (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField, type = '' }) {
  let url = `${baseUrl}/v004/push/messages?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  if (type) {
    url = url.concat(`&type=${type}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformPushNotification);
  return body;
}

export async function fetchPushNotification (baseUrl, authenticationToken, locale, { pushNotificationId }) {
  const url = `${baseUrl}/v004/push/messages/${pushNotificationId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformPushNotification(body);
  return result;
}

export async function deletePushNotification (baseUrl, authenticationToken, locale, { pushNotificationId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/push/messages/${pushNotificationId}`);
}

export async function deletePushNotifications (baseUrl, authenticationToken, locale, { pushNotificationsIds }) {
  for (const pushNotificationId of pushNotificationsIds) {
    await deletePushNotification(baseUrl, authenticationToken, locale, { pushNotificationId });
  }
}

export async function persistPushNotification (baseUrl, authenticationToken, locale, {
  defaultLocale, pushNotificationId, payloadData, payloadType, locales, basedOnDefaultLocale }) {
  let pushNotification = {};
  if (pushNotificationId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/push/messages/${pushNotificationId}`);
    pushNotification = body;
  }
  pushNotification.defaultLocale = defaultLocale;
  // Update locale data.
  pushNotification.localeData = []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = pushNotification.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      pushNotification.localeData.push(localeData);
    }
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.payload = {};
    localeData.payload.data = payloadData && payloadData[locale];
    localeData.payload.type = payloadType && payloadType[locale];
  });
  const url = `${baseUrl}/v004/push/messages`;
  const result = await post(authenticationToken, locale, url, pushNotification);
  return transformPushNotification(result.body);
}
