import { del, get, post } from './request';
import { transformListCollection, transformCollection } from './transformers';

export async function fetchMediumCollections (baseUrl, authenticationToken, locale, { mediumId, page = 0, pageSize = 1000, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/itemCollections?page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListCollection);
  return body;
}

export async function fetchCollection (baseUrl, authenticationToken, locale, { collectionId }) {
  const url = `${baseUrl}/v004/media/mediumItemCollections/${collectionId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformCollection(body);
}

export async function persistCollection (baseUrl, authenticationToken, locale, {
  /* basedOnDefaultLocale, */ brandId, characterId, collectionId, defaultLocale, linkType,
  locales, mediumId, recurring, title
}) {
  let collection = {};
  if (collectionId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/mediumItemCollections/${collectionId}`);
    collection = body;
  }

  collection.defaultLocale = defaultLocale;
  collection.linkedBrand = linkType === 'BRAND' && brandId ? { uuid: brandId } : null;
  collection.linkedCharacter = linkType === 'CHARACTER' && characterId ? { uuid: characterId } : null;
  collection.linkType = linkType;
  collection.medium = { uuid: mediumId };
  collection.recurring = recurring;
  // Update locale data.
  collection.localeData = [];
  locales.forEach((locale) => {
    const localeData = {};
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = false;
    // basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.title = title && title[locale];
    localeData.locale = locale;
    collection.localeData.push(localeData);
  });
  const url = `${baseUrl}/v004/media/mediumItemCollections`;
  const result = await post(authenticationToken, locale, url, collection);
  return transformCollection(result.body);
}

export async function deleteCollection (baseUrl, authenticationToken, locale, { collectionId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/mediumItemCollections/${collectionId}`);
}

export async function moveCollection (baseUrl, authenticationToken, locale, { before = true, sourceCollectionId, targetCollectionId }) {
  const url = `${baseUrl}/v004/media/mediumItemCollections/${sourceCollectionId}/actions/${before ? 'moveInFrontOf' : 'moveBehind'}?otherCollectionUuid=${targetCollectionId}`;
  await post(authenticationToken, locale, url, {});
}
