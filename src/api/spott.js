import { del, get, postFormData } from './request';
import { transformBrand, transformListSpott, transformSpott } from './transformers';

export async function fetchSpotts (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/post/posts?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListSpott);
  return body;
}

export async function fetchSpott (baseUrl, authenticationToken, locale, { spottId }) {
  const url = `${baseUrl}/v004/post/posts/${spottId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformSpott(body);
  return result;
}

export async function persistSpott (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, brandId, defaultLocale, comment, image, imageSource, locales,
  promoted, publishStatus, spottId, tags, title, topicIds, authorId }) {
  let spott = {};
  if (spottId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/post/posts/${spottId}`);
    spott = body;
  }

  spott.productMarkers = [];
  spott.personMarkers = [];
  console.warn('TO persist tags', tags);

  if (tags) {
    const personTags = tags.filter(({ entityType }) => entityType === 'CHARACTER' || entityType === 'PERSON');
    spott.personMarkers = personTags.map(({ characterId, entityType, personId, point }) => ({
      character: characterId ? { uuid: characterId } : null,
      person: personId ? { uuid: personId } : null,
      point
    }));

    const productTags = tags.filter(({ entityType }) => entityType === 'PRODUCT');
    spott.productMarkers = productTags.map(({ entityType, point, productCharacter, productId, relevance }) => ({
      character: productCharacter && productCharacter.entityType === 'CHARACTER' ? { uuid: productCharacter.id } : null,
      person: productCharacter && productCharacter.entityType === 'PERSON' ? { uuid: productCharacter.id } : null,
      point,
      product: { uuid: productId },
      relevance
    }));
  }

  spott.author = authorId ? { uuid: authorId } : null;
  spott.defaultLocale = defaultLocale;
  spott.imageSource = imageSource;
  spott.promoted = promoted;
  spott.promotedForBrand = promoted && brandId ? { uuid: brandId } : null;
  spott.publishStatus = publishStatus;

  spott.topics = (topicIds || []).map((id) => ({ uuid: id }));

  // Update locale data.
  spott.localeData = spott.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = spott.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      spott.localeData.push(localeData);
    }
    localeData.comment = comment && comment[locale];
    localeData.title = title && title[locale];
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
  });

  const formData = new FormData();
  formData.append('image', image);
  formData.append('json', new Blob([ JSON.stringify(spott) ], { type: 'application/json' }));

  const url = `${baseUrl}/v004/post/posts`;
  const result = await postFormData(authenticationToken, locale, url, formData);
  return transformSpott(result.body);
}

export async function deleteSpott (baseUrl, authenticationToken, locale, { spottId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/post/posts/${spottId}`);
}

export async function deleteSpotts (baseUrl, authenticationToken, locale, { spottIds }) {
  for (const spottId of spottIds) {
    await deleteSpott(baseUrl, authenticationToken, locale, { spottId });
  }
}
