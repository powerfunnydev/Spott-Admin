import { ACTIVE, INACTIVE, ADMIN, CONTENT_MANAGER, CONTENT_PRODUCER, BROADCASTER } from '../constants/userRoles';

export function transformBroadcaster ({ logo, name, uuid }) {
  return { logo: logo && { id: logo.uuid, url: logo.url }, name, id: uuid };
}

export function transformContentProducer ({ uuid, name, auditInfo, logo }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: logo && { id: logo.uuid, url: logo.url },
    name
  };
}

export function transformBrand ({ uuid, publishStatus, defaultLocale, localeData, auditInfo }) {
  const brand = {
    basedOnDefaultLocale: {},
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    description: {},
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    locales: [],
    logo: {},
    publishStatus,
    profileImage: {},
    name: {},
    tagLine: {}
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, description, logo, locale, name, profileCover, tagLine } of localeData) {
      brand.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      brand.description[locale] = description;
      brand.name[locale] = name;
      brand.logo[locale] = logo && { id: logo.uuid, url: logo.url };
      brand.profileImage[locale] = profileCover && { id: profileCover.uuid, url: profileCover.url };
      brand.tagLine[locale] = tagLine;
      brand.locales.push(locale);
    }
  }
  return brand;
}

export function transformShop ({ uuid, publishStatus, defaultLocale, localeData }) {
  const shop = {
    basedOnDefaultLocale: {},
    defaultLocale,
    description: {},
    id: uuid,
    locales: [],
    logo: {},
    url: {},
    publishStatus,
    name: {}
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, logo, locale, name, url } of localeData) {
      shop.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      shop.name[locale] = name;
      shop.url[locale] = url;
      shop.logo[locale] = logo && { id: logo.uuid, url: logo.url };
      shop.locales.push(locale);
    }
  }
  return shop;
}

export function transformListBrand ({ uuid, name, auditInfo, logo, profileCover }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: logo && { id: logo.uuid, url: logo.url },
    profileImage: profileCover && { id: profileCover.uuid, url: profileCover.url },
    name
  };
}

export function transformListShop ({ uuid, name, publishStatus, auditInfo, logo, profileCover }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: logo && { id: logo.uuid, url: logo.url },
    name,
    publishStatus
  };
}

export function transformBrandSubscription ({
  brand: { logo, name, uuid: brandId },
  count
}) {
  return {
    brand: {
      name,
      logo: logo && { id: logo.uuid, url: logo.url },
      id: brandId
    },
    count
  };
}

export function transformCharacterSubscription ({
  character: { name, portraitImage, uuid: characterId },
  count,
  medium: { title, uuid: mediumId }
}) {
  return {
    character: {
      name,
      portraitImage: portraitImage && { id: portraitImage.uuid, url: portraitImage.url },
      id: characterId
    },
    count,
    medium: { id: mediumId, title }
  };
}

export function transformListMediumCategory ({ name, uuid: id }) {
  return { name, id };
}

/**
 *  Light version of a medium. No locales includes.
 */
export function transformListMedium ({ number, publishStatus, auditInfo, title, type, posterImage, profileImage, uuid: id, season, serie }) {
  return {
    id,
    title,
    type,
    number,
    publishStatus,
    season: season && transformListMedium(season),
    serie: serie && transformListMedium(serie),
    posterImage: posterImage && { id: posterImage.uuid, url: posterImage. url },
    profileImage: profileImage && { id: profileImage.uuid, url: profileImage. url },
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
}

export function transformAvailability ({ country, endTimeStamp, startTimeStamp, uuid: id, videoStatus }) {
  return {
    availabilityFrom: startTimeStamp && new Date(startTimeStamp),
    availabilityTo: endTimeStamp && new Date(endTimeStamp),
    countryId: country && country.uuid,
    id,
    videoStatus
  };
}

export function transformListCharacter ({ auditInfo, profileImage, portraitImage, name, uuid: id }) {
  return {
    id,
    name,
    profileImage: profileImage && { id: profileImage.uuid, url: profileImage.url },
    portraitImage: portraitImage && { id: portraitImage.uuid, url: portraitImage.url },
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
}

// Temporary solution. Person is almost the same as character, except name calls fullName here...
export const transformListPerson = (person) => {
  const result = transformListCharacter(person);
  result.fullName = person.fullName;
  return result;
};

export function transformPerson ({
  auditInfo, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource }, uuid: id, publishStatus,
  localeData, portraitImage, profileCover, fullName, gender, dateOfBirth, placeOfBirth }) {
  const person = {
    basedOnDefaultLocale: {},
    dateOfBirth,
    description: {},
    fullName,
    gender,
    locales: [],
    placeOfBirth,
    profileImage: profileCover && { id: profileCover.uuid, url: profileCover.url },
    portraitImage: portraitImage && { id: portraitImage.uuid, url: portraitImage.url },
    defaultLocale,
    externalReference,
    externalReferenceSource,
    id,
    publishStatus,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, description, locale } of localeData) {
      person.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      person.description[locale] = description;
      person.locales.push(locale);
    }
  }
  return person;
}

export function transformCharacter ({
  actor, auditInfo, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource }, uuid: id, publishStatus,
 localeData, portraitImage, profileCover }) {
  const character = {
    person: transformListPerson(actor),
    basedOnDefaultLocale: {},
    description: {},
    name: {},
    locales: [],
    profileImage: profileCover && { id: profileCover.uuid, url: profileCover.url },
    portraitImage: portraitImage && { id: portraitImage.uuid, url: portraitImage.url },
    defaultLocale,
    externalReference,
    externalReferenceSource,
    id,
    publishStatus,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, description, locale, name } of localeData) {
      character.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      character.description[locale] = description;
      character.name[locale] = name;
      character.locales.push(locale);
    }
  }
  return character;
}

/**
 *  Complete version of a medium. Locales includes.
 */
export function transformMedium ({ availabilities, brand, broadcasters, characters, contentProducers, number,
  auditInfo, type, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource }, serie, season, uuid: id, publishStatus,
  defaultTitle, localeData, video, categories: mediumCategories }) {
  const medium = {
    availabilities: availabilities && availabilities.map(transformAvailability),
    brand: brand && transformListBrand(brand),
    broadcasters: broadcasters && broadcasters.map(transformBroadcaster),
    characters: characters && characters.map(transformListCharacter),
    contentProducers: contentProducers && contentProducers.map(transformContentProducer),
    mediumCategories: mediumCategories && mediumCategories.map((mc) => mc.uuid),
    number,
    basedOnDefaultLocale: {},
    description: {},
    startYear: {},
    endYear: {},
    hasTitle: {},
    title: {},
    subTitle: {},
    locales: [],
    posterImage: {},
    profileImage: {},
    defaultLocale,
    externalReference,
    externalReferenceSource,
    id,
    publishStatus,
    type,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    season: season && { title: season.title, id: season.uuid },
    seriesEntry: serie && { title: serie.title, id: serie.uuid },
    videoId: video && video.uuid
  };
  if (localeData) {
    for (const { hasTitle, basedOnDefaultLocale, description, locale,
      posterImage, profileCover, endYear, startYear, title, subTitle } of localeData) {
      medium.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      medium.description[locale] = description;
      medium.startYear[locale] = startYear;
      medium.endYear[locale] = endYear;
      medium.hasTitle[locale] = hasTitle;
      medium.title[locale] = title;
      medium.subTitle[locale] = subTitle;
      medium.locales.push(locale);
      medium.profileImage[locale] = profileCover ? { id: profileCover.uuid, url: profileCover.url } : null;
      medium.posterImage[locale] = posterImage ? { id: posterImage.uuid, url: posterImage.url } : null;
    }
  }
  return medium;
}

// Can transforms medium subscriptions and medium syncs.
export function transformMediumInfo ({
  medium: { posterImage, title, uuid: mediumId },
  count
}) {
  return {
    medium: {
      posterImage: posterImage && { id: posterImage.uuid, url: posterImage.url },
      title,
      id: mediumId
    },
    count
  };
}

export function transformProductView ({
  product: { image, shortName, uuid: productId },
  count
}) {
  return {
    product: {
      id: productId,
      image: image && { id: image.uuid, url: image.url },
      shortName
    },
    count
  };
}

export const transformProductBuy = transformProductView;
export const transformProductImpression = transformProductView;

export function transformActivityData (dataList, transformer) {
  const res = {};
  for (const { data, medium } of dataList) {
    res[medium.uuid] = transformer(data);
  }
  return res;
}

/**
  * @returnExample
  * {
  *   availabilityFrom: <date>,,
  *   availabilityPlatforms: [<id>],
  *   availabilityTo: <date>,
  *   availabilityVideoStatusType: 'DISABLED' || 'SYNCABLE' || 'INTERACTIVE',
  *   basedOnDefaultLocale: { en: false, fr: true, nl: false },
  *   defaultLocale: 'en',
  *   description: { en: 'Home', fr: 'A la maison', nl: 'Thuis' },
  *   endYear: { en: 1991, fr: 1991, nl: 1991 },
  *   externalReference: '...',
  *   externalReferenceSource: '...',
  *   hasTitle: { en: true, fr: true, nl: true },
  *   id: 'abcdef123',
  *   [keyVisual]: { en: ..., fr: ..., nl: ... },
  *   locales: [ 'en', 'fr', 'nl' ],
  *   number: 1,
  *   [poster]: { en: ..., fr: ..., nl: ... },
  *   publishStatus: 'DRAFT' || 'PUBLISH',
  *   relatedCharacterIds: [ '1234', '1235', ... ],
  *   seriesEntryId: 'abc123',
  *   startYear: { en: 1991, fr: 1991, nl: 1991 },
  *   title: { en: 'Home', fr: 'A la maison', nl: 'Thuis' }
  * }
  */
export function transformSeason ({ availabilities, characters, defaultLocale,
  externalReference: { reference: externalReference, source: externalReferenceSource },
  localeData, number, publishStatus, serie, uuid: id }) {
  const season = {
    // ...transformAvailabilitiesFromApi(availabilities),
    basedOnDefaultLocale: {},
    defaultLocale,
    description: {}, // Locale data
    endYear: {}, // Locale data
    externalReference,
    externalReferenceSource,
    hasTitle: {}, // Locale data
    id,
    keyVisual: {},  // Locale data
    locales: [],
    number,
    poster: {}, // Locale data
    publishStatus,
    relatedCharacterIds: characters.map((c) => c.character.uuid),
    seriesEntryId: serie.uuid,
    startYear: {}, // Locale data
    title: {} // Locale data
  };
  for (const { basedOnDefaultLocale, description, endYear, hasTitle, locale,
    posterImage, profileCover, startYear, title } of localeData) {
    season.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
    season.description[locale] = description;
    season.endYear[locale] = endYear;
    season.hasTitle[locale] = hasTitle;
    season.startYear[locale] = startYear;
    season.title[locale] = title;
    season.keyVisual[locale] = profileCover ? { id: profileCover.uuid, url: profileCover.url } : null;
    season.locales.push(locale);
    season.poster[locale] = posterImage ? { id: posterImage.uuid, url: posterImage.url } : null;
  }
  return season;
}
// Need to be refactored. Old versions need to be replaced by the 004 version.
export const transformSeriesEntry004 = transformMedium;
export const transformSeason004 = transformMedium;
export const transformEpisode004 = transformMedium;
// Already refactored -> OK
export const transformMovie = transformMedium;

export function transformCommercial (data) {
  const commercial = transformMedium(data);
  commercial.hasBanner = {};
  commercial.bannerBarColor = {};
  commercial.bannerLogo = {};
  commercial.bannerText = {};
  commercial.bannerTextColor = {};
  commercial.bannerUrl = {};

  const { localeData } = data;
  for (const { banner, locale } of localeData) {
    if (banner) {
      const { barColor, logo, text, textColor, url } = banner;
      commercial.hasBanner[locale] = true;
      commercial.bannerBarColor[locale] = barColor;
      commercial.bannerLogo[locale] = logo ? { id: logo.uuid, url: logo.url } : null;
      commercial.bannerText[locale] = text;
      commercial.bannerTextColor[locale] = textColor;
      commercial.bannerUrl[locale] = url;
    } else {
      commercial.hasBanner[locale] = false;
      commercial.bannerBarColor[locale] = '#000000';
      commercial.bannerTextColor[locale] = '#000000';
    }
  }
  return commercial;
}

export const transformListEpisode = transformListMedium;
export const transformListSeason = transformListMedium;
export const transformListSeriesEntry = transformListMedium;
export const transformListMovie = transformListMedium;

export const transformListCommercial = transformListMedium;

export function transformBroadcastChannel ({ name, auditInfo, uuid: id, logo, broadcaster }) {
  return {
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    broadcaster: broadcaster && { id: broadcaster.uuid },
    id,
    logo: logo && { id: logo.uuid, url: logo.url },
    name
  };
}

export function transformTvGuideEntry ({ auditInfo: { lastUpdatedBy, lastUpdatedOn }, uuid: id, start, end, medium, medium: { season }, channel }) {
  return {
    start, end, id, lastUpdatedBy, lastUpdatedOn,
    medium: transformListMedium(medium),
    channel: transformBroadcastChannel(channel),
    season: season && transformListMedium(season),
    serie: season && season.serie && transformListMedium(season.serie)
  };
}

// TODO channel and channelInfo must be one object (task for backend).
export function transformSingleTvGuideEntry ({ auditInfo: { lastUpdatedBy, lastUpdatedOn }, uuid: id, start, end, medium,
  season, channel }) {
  return {
    start, end, id, lastUpdatedBy, lastUpdatedOn,
    medium: transformListMedium(medium),
    channel: channel && transformBroadcastChannel(channel),
    season: medium.season && transformListMedium(medium.season),
    serie: medium.serie && transformListMedium(medium.serie)
  };
}

export function transformPaging ({ page, pageCount, pageSize, totalResultCount }) {
  return { page, pageCount, pageSize, totalResultCount };
}

export function transformUser ({ profileImage, avatar, languages, dateOfBirth, disabled, disabledReason,
  userName, gender, firstName, lastName, email, uuid: id, roles, ...restProps }) {
  const obj = {};
  const broadcasters = [];
  const contentProducers = [];
  roles && roles.map((role) => {
    if (role.role === BROADCASTER) {
      obj.broadcaster = true;
      broadcasters.push(role.context.uuid);
    } else
    if (role.role === CONTENT_PRODUCER) {
      obj.contentProducer = true;
      contentProducers.push(role.context.uuid);
    } else
    if (role.role === ADMIN) { obj.sysAdmin = true; } else
    if (role.role === CONTENT_MANAGER) { obj.contentManager = true; }
  });
  return {
    ...obj,
    broadcasters,
    contentProducers,
    avatar: avatar && { id: avatar.uuid, url: avatar.url },
    profileImage: profileImage && { id: profileImage.uuid, url: profileImage.url },
    userStatus: disabled && INACTIVE || ACTIVE,
    languages,
    disabledReason,
    dateOfBirth,
    userName,
    email,
    firstName,
    lastName,
    gender,
    id
  };
}

function transformFingerprint ({ audioFilename, fingerprintId, spokenLanguage, type }) {
  return {
    audioFilename,
    fingerprint: fingerprintId,
    language: spokenLanguage,
    type
  };
}

function transformScene ({ hidden, image, offsetInSeconds, status, uuid: id }) {
  return {
    hidden,
    id,
    image: image && { id: image.uuid, url: image.url },
    offsetInSeconds
  };
}

export function transformVideo ({ audioFingerprints, description,
  externalReference: { reference: externalReference, source: externalReferenceSource },
  medium: { profileImage }, scenes, totalDurationInSeconds, uuid: id, videoFilename }) {
  return {
    audioFingerprints: audioFingerprints && audioFingerprints.map(transformFingerprint),
    description,
    externalReference,
    externalReferenceSource,
    id,
    medium: { profileImage: profileImage && { id: profileImage.uuid, url: profileImage.url } },
    scenes: scenes && scenes.map(transformScene),
    totalDurationInSeconds,
    videoFilename
  };
}

export function transformCharacterFaceImage ({ image, uuid: id }) {
  return {
    id,
    image: { url: image && image.url }
  };
}

export const transformPersonFaceImage = transformCharacterFaceImage;
