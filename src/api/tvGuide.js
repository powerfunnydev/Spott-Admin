import { get } from './request';
import { transformTvGuide } from './transformers';

export async function fetchTvGuide (baseUrl, authenticationToken, locale, { page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/tvGuideEntries?page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  console.log('body', body);
  return transformTvGuide(body);
}
