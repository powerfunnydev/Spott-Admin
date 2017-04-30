import { del, get, post, postFormData } from './request';
import { transformProductOffering, transformBrand, transformListBrand, transformListProduct, transformUser } from './transformers';

export async function fetchBrands (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/brands?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListBrand);
  return body;
}

export async function fetchProducts (baseUrl, authenticationToken, locale, { brandId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/brands/${brandId}/products?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
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

export async function fetchBrandUsers (baseUrl, authenticationToken, locale, { brandId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/brands/${brandId}/users?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformUser);
  return body;
}

export async function fetchBrand (baseUrl, authenticationToken, locale, { brandId }) {
  const url = `${baseUrl}/v004/product/brands/${brandId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformBrand(body);
  return result;
}

export async function persistBrand (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, publishStatus,
  brandId, name, tagLine }) {
  let brand = {};
  if (brandId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/brands/${brandId}`);
    brand = body;
  }

  brand.defaultLocale = defaultLocale;
  brand.publishStatus = publishStatus;

  // Update locale data.
  brand.localeData = brand.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = brand.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      brand.localeData.push(localeData);
    }
    localeData.name = name && name[locale];
    localeData.tagLine = tagLine && tagLine[locale];
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
  });
  console.log('brand post', brand);
  const url = `${baseUrl}/v004/product/brands`;
  const result = await post(authenticationToken, locale, url, brand);
  return transformBrand(result.body);
}

export async function deleteBrand (baseUrl, authenticationToken, locale, { brandId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/product/brands/${brandId}`);
}

export async function deleteBrands (baseUrl, authenticationToken, locale, { brandIds }) {
  for (const brandId of brandIds) {
    await deleteBrand(baseUrl, authenticationToken, locale, { brandId });
  }
}

export async function searchBrands (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25 }) {
  let url = `${baseUrl}/v004/product/brands?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListBrand);
}

export async function searchMediumBrands (baseUrl, authenticationToken, locale, { mediumId, searchString = '', page = 0, pageSize = 100 }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/brandDeals?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListBrand);
}

export async function persistMediumBrand (baseUrl, authenticationToken, locale, { brandId, mediumId }) {
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/brandDeals/${brandId}`, {});
  return transformBrand(body);
}

export async function deleteMediumBrand (baseUrl, authenticationToken, locale, { brandId, mediumId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/brandDeals/${brandId}`, {});
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { brandId, image, locale: imageLocale, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/product/brands/${brandId}/profileCover`, formData, callback);
  return transformBrand(result.body);
}

export async function uploadLogoImage (baseUrl, authenticationToken, locale, { brandId, image, locale: imageLocale, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/product/brands/${brandId}/logo`, formData, callback);
  return transformBrand(result.body);
}

export async function deleteLogoImage (baseUrl, authenticationToken, locale, { locale: mediumLocale, brandId }) {
  let url = `${baseUrl}/v004/product/brands/${brandId}/logo`;
  if (mediumLocale) {
    url = `${url }?locale=${mediumLocale}`;
  }
  await del(authenticationToken, locale, url);
}

export async function deleteProfileImage (baseUrl, authenticationToken, locale, { locale: mediumLocale, brandId }) {
  let url = `${baseUrl}/v004/product/brands/${brandId}/profileCover`;
  if (mediumLocale) {
    url = `${url }?locale=${mediumLocale}`;
  }
  await del(authenticationToken, locale, url);
}

export async function persistLinkUser (baseUrl, authenticationToken, locale, { brandId, userId }) {
  const url = `${baseUrl}/v004/product/brands/${brandId}/users/${userId}`;
  return await post(authenticationToken, locale, url);
}

export async function deleteLinkUser (baseUrl, authenticationToken, locale, { brandId, userId }) {
  const url = `${baseUrl}/v004/product/brands/${brandId}/users/${userId}`;
  return await del(authenticationToken, locale, url);
}

export async function deleteLinkUsers (baseUrl, authenticationToken, locale, { brandId, userIds }) {
  for (const userId of userIds) {
    await deleteLinkUser(baseUrl, authenticationToken, locale, { brandId, userId });
  }
}
