import { del, get, post, postFormData } from './request';
import { transformProduct, transformListProduct, transformProductOffering } from './transformers';

export async function fetchProducts (baseUrl, authenticationToken, locale, { publishStatus, used, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/products?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url += `&searchString=${searchString}`;
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url += `&sortField=${sortField}&sortDirection=${sortDirection}`;
  }
  if (publishStatus) {
    url += `&publishStatus=${publishStatus}`;
  }
  if (used) {
    url += `&used=${used}`;
  }
  const { body } = await get(authenticationToken, locale, url);
  const data = [];
  for (const product of body.data) {
    const prod = transformListProduct(product);
    const result = await get(authenticationToken, locale, `${baseUrl}/v004/product/products/${prod.id}/offerings`);
    prod.offerings = result.body.data.map(transformProductOffering);
    data.push(prod);
  }
  body.data = data;
  return body;
}

export async function fetchProductOfferings (baseUrl, authenticationToken, locale, { productId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/products/${productId}/offerings?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformProductOffering);
  return body;
}

export async function fetchProduct (baseUrl, authenticationToken, locale, { productId }) {
  const url = `${baseUrl}/v004/product/products/${productId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformProduct(body);
  return result;
}

export async function persistProduct (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, noLongerAvailable,
  publishStatus, categories, tags, productId, shortName, fullName, brandId }) {
  let product = {};
  if (productId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}`);
    product = body;
  }
  product.defaultLocale = defaultLocale;
  product.publishStatus = publishStatus;
  product.noLongerAvailable = noLongerAvailable;
  product.brand = { uuid: brandId };
  product.categories = categories && categories.map((id) => ({ uuid: id }));
  product.tags = tags && tags.map((id) => ({ uuid: id }));
  // Update locale data.
  product.localeData = []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = product.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      product.localeData.push(localeData);
    }
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    localeData.shortName = shortName && shortName[locale];
    localeData.fullName = fullName && fullName[locale];
  });
  const url = `${baseUrl}/v004/product/products`;
  const result = await post(authenticationToken, locale, url, product);
  return transformProduct(result.body);
}

export async function deleteProduct (baseUrl, authenticationToken, locale, { productId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}`);
}

export async function deleteProducts (baseUrl, authenticationToken, locale, { productIds }) {
  for (const productId of productIds) {
    await deleteProduct(baseUrl, authenticationToken, locale, { productId });
  }
}

export async function searchProducts (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25 }) {
  let url = `${baseUrl}/v004/product/products?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListProduct);
}

export async function uploadImage (baseUrl, authenticationToken, locale, { productId, locale: imageLocale, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}/images`, formData, callback);
  return transformProduct(result.body);
}

export async function deleteImage (baseUrl, authenticationToken, locale, { productId, locale: imageLocale, imageId }) {
  let url = `${baseUrl}/v004/product/products/${productId}/images/${imageId}`;
  if (imageLocale) {
    url = `${url}?locale=${imageLocale}`;
  }
  const result = await del(authenticationToken, locale, url);
  return transformProduct(result.body);
}
