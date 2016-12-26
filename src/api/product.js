import { del, get, post, postFormData } from './request';
import { transformProduct, transformListProduct } from './transformers';

export async function fetchProducts (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/products?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListProduct);
  return body;
}

export async function fetchProduct (baseUrl, authenticationToken, locale, { productId }) {
  const url = `${baseUrl}/v004/product/products/${productId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformProduct(body);
  return result;
}

export async function persistProduct (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, publishStatus,
  productId, shortName, fullName, brandId }) {
  let product = {};
  if (productId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}`);
    product = body;
  }
  product.defaultLocale = defaultLocale;
  product.publishStatus = publishStatus;
  product.brand = { uuid: brandId };
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

export async function uploadImage (baseUrl, authenticationToken, locale, { productId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}/images`, formData, callback);
}

export async function deleteImage (baseUrl, authenticationToken, locale, { productId, imageId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/product/products/${productId}/images/${imageId}`);
}
