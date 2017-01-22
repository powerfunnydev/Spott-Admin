import { del, get, post } from './request';
import { transformListCollectionItem } from './transformers';

export async function fetchCollectionItems (baseUrl, authenticationToken, locale, { collectionId, page = 0, pageSize = 1000, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/mediumItemCollections/${collectionId}/entries?page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListCollectionItem);
  return body;
}

export async function fetchCollectionItem (baseUrl, authenticationToken, locale, { collectionItemId }) {
  const url = `${baseUrl}/v004/media/mediumItemCollectionEntries/${collectionItemId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformListCollectionItem(body);
}

export async function persistCollectionItem (baseUrl, authenticationToken, locale, {
  collectionId, collectionItemId, productId, relevance
}) {
  let collectionItem = {};
  if (collectionItemId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/mediumItemCollectionEntries/${collectionItemId}`);
    collectionItem = body;
  }
  collectionItem.collection = collectionId && { uuid: collectionId };
  collectionItem.product = { uuid: productId };
  collectionItem.productRelevance = relevance;
  const url = `${baseUrl}/v004/media/mediumItemCollectionEntries`;
  const result = await post(authenticationToken, locale, url, collectionItem);
  return transformListCollectionItem(result.body);
}

export async function deleteCollectionItem (baseUrl, authenticationToken, locale, { collectionItemId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/mediumItemCollectionEntries/${collectionItemId}`);
}

export async function moveCollectionItem (baseUrl, authenticationToken, locale, { before = true, collectionItemId, targetCollectionItemId }) {
  const url = `${baseUrl}/v004/media/mediumItemCollectionEntries/${collectionItemId}/actions/${before ? 'moveInFrontOf' : 'moveBehind'}?otherEntryUuid=${targetCollectionItemId}`;
  await post(authenticationToken, locale, url, {});
}
