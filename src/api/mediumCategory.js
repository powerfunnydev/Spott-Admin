import { get, post, del } from './request';
import { transformListMediumCategory, transformMediumCategory } from './transformers';

export async function fetchMediumCategories (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 100, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/mediumCategories?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListMediumCategory);
  return body;
}

export async function fetchMediumCategory (baseUrl, authenticationToken, locale, { mediumCategoryId }) {
  const url = `${baseUrl}/v004/media/mediumCategories/${mediumCategoryId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformMediumCategory(body);
}

export async function persistMediumCategory (baseUrl, authenticationToken, locale, {
  mediumCategoryId, defaultLocale, locales, name }) {
  let mediumCategory = {};
  if (mediumCategoryId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/mediumCategories/${mediumCategoryId}`);
    mediumCategory = body;
  }
  mediumCategory.defaultLocale = defaultLocale;
  mediumCategory.localeData = [];
  locales.forEach((locale) => {
    const localeData = {};
    localeData.name = name && name[locale];
    localeData.locale = locale;
    mediumCategory.localeData.push(localeData);
  });
  const url = `${baseUrl}/v004/media/mediumCategories`;
  const result = await post(authenticationToken, locale, url, mediumCategory);
  return transformMediumCategory(result.body);
}

// Used for autocompletion.
export async function searchMediumCategories (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/media/mediumCategories?pageSize=100`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformListMediumCategory);
}

export async function deleteMediumCategory (baseUrl, authenticationToken, locale, { mediumCategoryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/mediumCategories/${mediumCategoryId}`);
}
