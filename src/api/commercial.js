import { del, get, post, postFormData } from './request';
import { transformListCommercial, transformCommercial } from './transformers';

export async function fetchCommercials (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/commercials?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListCommercial);
  return body;
}

export async function fetchCommercial (baseUrl, authenticationToken, locale, { commercialId }) {
  const url = `${baseUrl}/v004/media/commercials/${commercialId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformCommercial(body);
}

export async function persistCommercial (baseUrl, authenticationToken, locale, {
  bannerBarColor, bannerText, bannerTextColor, bannerUrl, basedOnDefaultLocale,
  brandId, broadcasters, commercialId, contentProducers, defaultLocale,
  description, hasBanner, locales, publishStatus, title
}) {
  let commercial = {};
  if (commercialId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/commercials/${commercialId}`);
    commercial = body;
  }

  commercial.contentProducers = contentProducers && contentProducers.map((cp) => ({ uuid: cp }));
  commercial.brand = brandId && { uuid: brandId };
  commercial.broadcasters = broadcasters && broadcasters.map((bc) => ({ uuid: bc }));
  commercial.defaultLocale = defaultLocale;
  commercial.publishStatus = publishStatus;
  // Update locale data.
  commercial.localeData = commercial.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    // Get localeData, create if necessary in O(n^2)
    let localeData = commercial.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      commercial.localeData.push(localeData);
    }

    localeData.banner = hasBanner && hasBanner[locale] ? {
      barColor: bannerBarColor[locale],
      text: bannerText[locale],
      textColor: bannerTextColor[locale],
      url: bannerUrl[locale]
    } : null;
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    localeData.title = title && title[locale];
  });
  const url = `${baseUrl}/v004/media/commercials`;
  const result = await post(authenticationToken, locale, url, commercial);
  return transformCommercial(result.body);
}

export async function deleteCommercial (baseUrl, authenticationToken, locale, { commercialId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/commercials/${commercialId}`);
}

export async function deleteCommercials (baseUrl, authenticationToken, locale, { commercialIds }) {
  for (const commercialId of commercialIds) {
    await deleteCommercial(baseUrl, authenticationToken, locale, { commercialId });
  }
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { commercialId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${commercialId}/profileCover`, formData, callback);
  return transformCommercial(result.body);
}

export async function uploadRoundLogo (baseUrl, authenticationToken, locale, { commercialId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${commercialId}/roundLogo`, formData, callback);
  return transformCommercial(result.body);
}
