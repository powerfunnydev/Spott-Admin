import { del, get, post, postFormData } from './request';
import { transformContentProducers, transformContentProducer } from './transformers';


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
  const result = transformContentProducer(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistContentProducer (baseUrl, authenticationToken, locale, { id, name }) {
  let cp = {};
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/contentProducers/${id}`);
    console.log('body', body);
    cp = body;
  }
  const url = `${baseUrl}/v004/media/contentProducers`;
  await post(authenticationToken, locale, url, { ...cp, uuid: id, name });
}

export async function deleteContentProducerEntry (baseUrl, authenticationToken, locale, { contentProducerEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/contentProducers/${contentProducerEntryId}`);
}

export async function deleteContentProducerEntries (baseUrl, authenticationToken, locale, { contentProducerEntryIds }) {
  for (const contentProducerEntryId of contentProducerEntryIds) {
    await deleteContentProducerEntry(baseUrl, authenticationToken, locale, { contentProducerEntryId });
  }
}

// Used for autocompletion.
export async function searchContentProducers (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/contentProducers?pageSize=25`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformContentProducer);
}

export async function uploadContentProducerImage (baseUrl, authenticationToken, locale, { contentProducerEntryId, image, callback }) {
  const formData = new FormData();
  formData.append('uuid', contentProducerEntryId);
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/contentProducers/${contentProducerEntryId}/logo`, formData, callback);
}
