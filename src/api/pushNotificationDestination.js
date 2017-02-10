import { get } from './request';
import { transformListPushNotificationDestination } from './transformers';

// Used for autocompletion.
export async function searchPushNotificationDestinations (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/push/actionTypes?pageSize=100`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body } = await get(authenticationToken, locale, searchUrl);
  return body.map(transformListPushNotificationDestination);
}
