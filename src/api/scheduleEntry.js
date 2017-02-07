import { del, get, post } from './request';
import { transformScheduleEntry } from './transformers';

export async function fetchScheduleEntry (baseUrl, authenticationToken, locale, { scheduleEntryId }) {
  const url = `${baseUrl}/v004/media/commercialScheduleEntries/${scheduleEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformScheduleEntry(body);
}

export async function persistScheduleEntry (baseUrl, authenticationToken, locale, {
  bannerActorId, bannerBarColor, bannerBrandId, bannerCharacterId, bannerExternalLink,
  bannerInternalLinkType, bannerMediumId, bannerSystemLinkType, bannerText, bannerTextColor, bannerUrl,
  basedOnDefaultLocale, brandId, broadcasters, commercialId, contentProducers, defaultLocale,
  description, hasBanner, locales, publishStatus, title
}) {
  let commercial = {};
  if (commercialId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/commercials/${commercialId}`);
    commercial = body;
  }

  commercial.brand = brandId && { uuid: brandId };
  commercial.broadcasters = broadcasters && broadcasters.map((bc) => ({ uuid: bc }));
  commercial.contentProducers = contentProducers && contentProducers.map((cp) => ({ uuid: cp }));
  commercial.defaultLocale = defaultLocale;
  commercial.hasBanner = hasBanner;
  commercial.publishStatus = publishStatus;

  commercial.bannerActor = null;
  commercial.bannerBrand = null;
  commercial.bannerCharacter = null;
  commercial.bannerMedium = null;

  if (hasBanner) {
    if (bannerSystemLinkType === 'INTERNAL') {
      commercial.bannerLinkType = bannerInternalLinkType;

      switch (bannerInternalLinkType) {
        case 'ACTOR':
          commercial.bannerActor = { uuid: bannerActorId };
          break;
        case 'BRAND':
          commercial.bannerBrand = { uuid: bannerBrandId };
          break;
        case 'CHARACTER':
          commercial.bannerCharacter = { uuid: bannerCharacterId };
          break;
        case 'MEDIUM':
          commercial.bannerMedium = { uuid: bannerMediumId };
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
      commercial.bannerExternalLink = hasBanner ? bannerExternalLink[locale] : null;
    }

    localeData.banner = hasBanner ? {
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
  return transformScheduleEntry(result.body);
}

export async function deleteScheduleEntry (baseUrl, authenticationToken, locale, { scheduleEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/commercialScheduleEntries/${scheduleEntryId}`);
}

export async function deleteScheduleEntries (baseUrl, authenticationToken, locale, { scheduleEntryIds }) {
  for (const scheduleEntryId of scheduleEntryIds) {
    await deleteScheduleEntry(baseUrl, authenticationToken, locale, { scheduleEntryId });
  }
}
