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
/**
 *  Light version of a medium. No locales includes.
 */
export function transformListMedium ({ number, auditInfo, title, type, posterImage, profileImage, uuid: id }) {
  return {
    id,
    title,
    type,
    number,
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

export function transformCharacter ({
  actor, auditInfo, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource }, uuid: id, publishStatus,
 localeData, portraitImage, profileCover }) {
  const character = {
    personId: actor.uuid,
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
export function transformMedium ({ availabilities, broadcasters, characters, contentProducers, number,
  auditInfo, type, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource }, serieInfo: serie, seasonInfo, uuid: id, publishStatus,
  defaultTitle, localeData, video }) {
  let serieInfo = serie;
  if (seasonInfo) {
    serieInfo = seasonInfo.serie;
  }
  const medium = {
    availabilities: availabilities && availabilities.map(transformAvailability),
    characters: characters && characters.map(transformListCharacter),
    contentProducers: contentProducers && contentProducers.map((cp) => cp.uuid),
    broadcasters: broadcasters && broadcasters.map((bc) => bc.uuid),
    number,
    basedOnDefaultLocale: {},
    description: {},
    startYear: {},
    endYear: {},
    hasTitle: {},
    title: {},
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
    season: seasonInfo && { title: seasonInfo.title, id: seasonInfo.uuid },
    seriesEntry: serieInfo && { title: serieInfo.title, id: serieInfo.uuid },
    videoId: video && video.uuid
  };
  if (localeData) {
    for (const { hasTitle, basedOnDefaultLocale, description, locale,
      posterImage, profileCover, endYear, startYear, title } of localeData) {
      medium.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      medium.description[locale] = description;
      medium.startYear[locale] = startYear;
      medium.endYear[locale] = endYear;
      medium.hasTitle[locale] = hasTitle;
      medium.title[locale] = title;
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
export const transformSeriesEntry004 = transformMedium;
export const transformSeason004 = transformMedium;
export const transformEpisode004 = transformMedium;

export const transformListEpisode = transformListMedium;
export const transformListSeason = transformListMedium;
export const transformListSeriesEntry = transformListMedium;

export function transformBroadcastChannel ({ name, uuid: id, logo, broadcaster }) {
  return {
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
export function transformSingleTvGuideEntry ({ auditInfo: { lastUpdatedBy, lastUpdatedOn }, uuid: id, start, end, mediumInfo,
  mediumInfo: { season }, channel: { uuid: channelUuid }, channelInfo }) {
  return {
    start, end, id, lastUpdatedBy, lastUpdatedOn,
    medium: transformListMedium(mediumInfo),
    channel: transformBroadcastChannel(channelInfo),
    season: season && transformListMedium(season),
    serie: season && season.serie && transformListMedium(season.serie)
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
    userStatus: disabled && ACTIVE || INACTIVE,
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
  scenes, totalDurationInSeconds, uuid: id, videoFilename }) {
  return {
    audioFingerprints: audioFingerprints && audioFingerprints.map(transformFingerprint),
    description,
    externalReference,
    externalReferenceSource,
    id,
    scenes: scenes && scenes.map(transformScene),
    totalDurationInSeconds,
    videoFilename
  };
}

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
// Temporary solution. Person is almost the same as character, except name calls fullName here...
export const transformListPerson = (person) => {
  const result = transformListCharacter(person);
  result.fullName = person.fullName;
  return result;
};

export function transformCharacterFaceImage ({ image, uuid: id }) {
  return {
    id,
    image: { url: image && image.url }
  };
}

export const transformPersonFaceImage = transformCharacterFaceImage;
