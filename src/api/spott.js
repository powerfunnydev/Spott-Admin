import { del, get, postFormData } from './request';
import { transformBrand, transformListSpott, transformSpott } from './transformers';

export async function fetchSpotts (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/post/posts?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
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
  basedOnDefaultLocale, defaultLocale, comment, image, locales, promoted, publishStatus,
  spottId, title, topicIds }) {
  let spott = {};
  if (spottId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/post/posts/${spottId}`);
    spott = body;
  }

  spott.defaultLocale = defaultLocale;
  spott.promoted = promoted;
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
  const result = await postFormData(authenticationToken, locale, url, formData, () => console.warn('uploading...'));
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
