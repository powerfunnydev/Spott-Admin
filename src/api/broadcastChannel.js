import * as request from './request';
import { transformBroadcastChannel } from './transformers';

export async function searchBroadcastChannels (baseUrl, authenticationToken, locale, { searchString }) {
  let searchUrl = `${baseUrl}/v004/media/broadcastChannels?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await request.get(authenticationToken, locale, searchUrl);
  return data.map(transformBroadcastChannel);
}
