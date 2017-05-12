import { del, get, post, postFormData } from './request';
import { transformListCommercial, transformCommercial, transformScheduleEntry } from './transformers';

export async function fetchCommercials (baseUrl, authenticationToken, locale, { brandFilter, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/commercials?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  if (brandFilter) {
    url = url.concat(`&brand=${brandFilter}`);
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
  bannerActorId, bannerBarColor, bannerBrandId, bannerCharacterId, bannerDirectLink, bannerExternalLink,
  bannerInternalLinkType, bannerMediumId, bannerSystemLinkType,
  basedOnDefaultLocale, brandId, broadcasters, commercialId, contentProducers, defaultLocale,
  description, hasBanner, live, locales, publishStatus, title
}) {
  let commercial = {};
  if (commercialId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/commercials/${commercialId}`);
    commercial = body;
  }

  commercial.bannerDirectLink = bannerDirectLink;
  commercial.brand = brandId && { uuid: brandId };
  commercial.broadcasters = broadcasters && broadcasters.map((bc) => ({ uuid: bc }));
  commercial.contentProducers = contentProducers && contentProducers.map((cp) => ({ uuid: cp }));
  commercial.defaultLocale = defaultLocale;
  commercial.hasBanner = hasBanner;
  commercial.live = live;
  commercial.publishStatus = publishStatus;

  commercial.bannerActor = null;
  commercial.bannerBrand = null;
  commercial.bannerCharacter = null;
  commercial.bannerMedium = null;
  commercial.bannerLinkType = null;

  if (hasBanner) {
    if (bannerSystemLinkType === 'INTERNAL') {
      commercial.bannerLinkType = bannerInternalLinkType;

      switch (bannerInternalLinkType) {
        case 'ACTOR':
          commercial.bannerActor = bannerActorId ? { uuid: bannerActorId } : null;
          break;
        case 'BRAND':
          commercial.bannerBrand = bannerBrandId ? { uuid: bannerBrandId } : null;
          break;
        case 'CHARACTER':
          commercial.bannerCharacter = bannerCharacterId ? { uuid: bannerCharacterId } : null;
          break;
        case 'MEDIUM':
          commercial.bannerMedium = bannerMediumId ? { uuid: bannerMediumId } : null;
          break;
      }
    } else {
      commercial.bannerLinkType = 'EXTERNAL';
    }
  }

  // Update locale data.
  commercial.localeData = commercial.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    // Get localeData, create if necessary in O(n^2)
    let localeData = commercial.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      commercial.localeData.push(localeData);
    }

    if (bannerSystemLinkType === 'EXTERNAL') {
      localeData.bannerExternalLink = hasBanner ? bannerExternalLink[locale] : null;
    }
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

export async function deleteBannerImage (baseUrl, authenticationToken, locale, { commercialId, locale: mediumLocale }) {
  let url = `${baseUrl}/v004/media/commercials/${commercialId}/bannerImage`;
  if (mediumLocale) {
    url = `${url }?locale=${mediumLocale}`;
  }
  const result = await del(authenticationToken, locale, url, { locale: mediumLocale });
  return transformCommercial(result.body);
}

export async function uploadBannerImage (baseUrl, authenticationToken, locale, { commercialId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/commercials/${commercialId}/bannerImage`, formData, callback);
  return transformCommercial(result.body);
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { commercialId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${commercialId}/profileCover`, formData, callback);
  return transformCommercial(result.body);
}

export async function uploadPosterImage (baseUrl, authenticationToken, locale, { locale: imageLocale, commercialId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  formData.append('locale', imageLocale);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${commercialId}/posterImage`, formData, callback);
  return transformCommercial(result.body);
}

export async function uploadRoundLogo (baseUrl, authenticationToken, locale, { commercialId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${commercialId}/roundLogo`, formData, callback);
  return transformCommercial(result.body);
}

export async function fetchScheduleEntries (baseUrl, authenticationToken, locale, { commercialId }) {
  const url = `${baseUrl}/v004/media/commercials/${commercialId}/scheduleEntries`;
  const { body } = await get(authenticationToken, locale, url);
  return body.data.map(transformScheduleEntry);
}
