import { get, post, del } from './request';
import { transformListProductCategory, transformProductCategory } from './transformers';

export async function fetchProductCategories (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 100, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/categories?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListProductCategory);
  return body;
}

export async function fetchProductCategory (baseUrl, authenticationToken, locale, { productCategoryId }) {
  const url = `${baseUrl}/v004/product/categories/${productCategoryId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformProductCategory(body);
}

export async function persistProductCategory (baseUrl, authenticationToken, locale, {
  productCategoryId, defaultLocale, locales, name }) {
  let productCategory = {};
  if (productCategoryId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/categories/${productCategoryId}`);
    productCategory = body;
  }
  productCategory.defaultLocale = defaultLocale;
  productCategory.localeData = [];
  locales.forEach((locale) => {
    const localeData = {};
    localeData.name = name && name[locale];
    localeData.locale = locale;
    productCategory.localeData.push(localeData);
  });
  const url = `${baseUrl}/v004/product/categories`;
  const result = await post(authenticationToken, locale, url, productCategory);
  return transformProductCategory(result.body);
}

// Used for autocompletion.
export async function searchProductCategories (baseUrl, authenticationToken, locale, { searchString = '' }) {
  let searchUrl = `${baseUrl}/v004/product/categories?pageSize=100`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformListProductCategory);
}

export async function deleteProductCategory (baseUrl, authenticationToken, locale, { productCategoryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/product/categories/${productCategoryId}`);
}
