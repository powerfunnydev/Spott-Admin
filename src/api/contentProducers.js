import { get } from './request';

export async function fetchContentProducers (baseUrl, authenticationToken, locale) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/media/contentProducers`);
  return data;
}

export async function fetchSortedContentProducers (baseUrl, authenticationToken, locale, { sortDirection, sortField }) {
  let url = `${baseUrl}/v003/media/contentProducers`;
  if (sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`?sortDirection=${sortDirection}&sortField=${sortField}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data;
}
