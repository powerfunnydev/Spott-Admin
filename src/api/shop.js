import { del, get, post, postFormData } from './request';
import { transformShop, transformListShop } from './transformers';

export async function fetchShops (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/product/shops?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListShop);
  return body;
}

export async function fetchShop (baseUrl, authenticationToken, locale, { shopId }) {
  const url = `${baseUrl}/v004/product/shops/${shopId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformShop(body);
  return result;
}

export async function persistShop (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, locales, publishStatus,
  shopId, name, url: shopUrl }) {
  let shop = {};
  if (shopId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/product/shops/${shopId}`);
    shop = body;
  }

  shop.defaultLocale = defaultLocale;
  shop.publishStatus = publishStatus;

  // Update locale data.
  shop.localeData = shop.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = shop.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      shop.localeData.push(localeData);
    }
    localeData.name = name && name[locale];
    localeData.url = shopUrl && shopUrl[locale];
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
  });
  console.log('shop post', shop);
  const url = `${baseUrl}/v004/product/shops`;
  const result = await post(authenticationToken, locale, url, shop);
  return transformShop(result.body);
}

export async function deleteShop (baseUrl, authenticationToken, locale, { shopId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/product/shops/${shopId}`);
}

export async function deleteShops (baseUrl, authenticationToken, locale, { shopIds }) {
  for (const shopId of shopIds) {
    await deleteShop(baseUrl, authenticationToken, locale, { shopId });
  }
}

export async function searchShops (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 100 }) {
  let url = `${baseUrl}/v004/product/shops?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListShop);
}

export async function searchMediumShops (baseUrl, authenticationToken, locale, { mediumId, searchString = '', page = 0, pageSize = 100 }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/shopDeals?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListShop);
}

export async function persistMediumShop (baseUrl, authenticationToken, locale, { mediumId, shopId }) {
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/shopDeals/${shopId}`, {});
  return transformShop(body);
}

export async function deleteMediumShop (baseUrl, authenticationToken, locale, { mediumId, shopId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/shopDeals/${shopId}`, {});
}

export async function uploadLogoImage (baseUrl, authenticationToken, locale, { shopId, image, locale: imageLocale, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/product/shops/${shopId}/logo`, formData, callback);
  return transformShop(result.body);
}

export async function deleteLogoImage (baseUrl, authenticationToken, locale, { locale: mediumLocale, shopId }) {
  let url = `${baseUrl}/v004/product/shops/${shopId}/logo`;
  if (mediumLocale) {
    url = `${url }?locale=${mediumLocale}`;
  }
  await del(authenticationToken, locale, url);
}
