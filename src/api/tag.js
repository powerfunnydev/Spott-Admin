import { del, get, post } from './request';
import { transformTag, transformListTag } from './transformers';

export async function fetchTags (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/system/tags?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListTag);
  return body;
}

export async function fetchTag (baseUrl, authenticationToken, locale, { tagId }) {
  const url = `${baseUrl}/v004/system/tags/${tagId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformTag(body);
  return result;
}

export async function persistTag (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, publishStatus,
  tagId, name, tagLine }) {
  let tag = {};
  if (tagId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/system/tags/${tagId}`);
    tag = body;
  }

  tag.defaultLocale = defaultLocale;
  tag.publishStatus = publishStatus;

  // Update locale data.
  tag.localeData = tag.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = tag.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      tag.localeData.push(localeData);
    }
    localeData.name = name && name[locale];
    localeData.tagLine = tagLine && tagLine[locale];
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
  });
  console.log('tag post', tag);
  const url = `${baseUrl}/v004/system/tags`;
  const result = await post(authenticationToken, locale, url, tag);
  return transformTag(result.body);
}

export async function deleteTag (baseUrl, authenticationToken, locale, { tagId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/system/tags/${tagId}`);
}

export async function deleteTags (baseUrl, authenticationToken, locale, { tagIds }) {
  for (const tagId of tagIds) {
    await deleteTag(baseUrl, authenticationToken, locale, { tagId });
  }
}

export async function searchTags (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25 }) {
  let url = `${baseUrl}/v004/system/tags?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListTag);
}
