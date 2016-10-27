import { del, get, post } from './request';
import { transformContentProducers } from './transformers';


export async function fetchContentProducers (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/contentProducers?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  return transformContentProducers(body);
}

export async function fetchContentProducerEntry (baseUrl, authenticationToken, locale, { contentProducerEntryId }) {
  const url = `${baseUrl}/v004/media/contentProducers/${contentProducerEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = { name: body.name };
  // console.log('after tranform', result);
  return result;
}

export async function persistContentProducer (baseUrl, authenticationToken, locale, { id, name }) {
  console.log('name', name);
  const url = `${baseUrl}/v004/media/contentProducers`;
  await post(authenticationToken, locale, url, { uuid: id, name });
}

export async function deleteContentProducerEntry (baseUrl, authenticationToken, locale, { contentProducerEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/contentProducers/${contentProducerEntryId}`);
}

export async function deleteContentProducerEntries (baseUrl, authenticationToken, locale, { contentProducerEntryIds }) {
  for (const contentProducerEntryId of contentProducerEntryIds) {
    await deleteContentProducerEntry(baseUrl, authenticationToken, locale, { contentProducerEntryId });
  }
}
