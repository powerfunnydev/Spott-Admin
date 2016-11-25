import { ACTIVE, INACTIVE, ADMIN, CONTENT_MANAGER, CONTENT_PRODUCER, BROADCASTER } from '../constants/userRoles';

export function transformBroadcaster ({ logo, name, uuid }) {
  return { logo: { url: logo && logo.url }, name, id: uuid };
}

export function transformContentProducer ({ uuid, name, auditInfo, logo }) {
  return { id: uuid, name, createdOn: auditInfo && auditInfo.createdOn, lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn, logo: { url: logo && logo.url } };
}
export function transformContentProducers (body) {
  const contentProducers = body.data;
  const data = [];
  for (const cp of contentProducers) {
    data.push(transformContentProducer(cp));
  }
  body.data = data;
  return body;
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
export function transformListMedium ({ auditInfo, title, type, posterImage, profileImage, uuid: id }) {
  return {
    id,
    title,
    type,
    posterImage: posterImage && { id: posterImage.uuid, url: posterImage. url },
    profileImage: profileImage && { id: profileImage.uuid, url: profileImage. url },
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
}

export function transformAvailability ({ country, endTimeStamp, startTimeStamp, videoStatus }) {
  return { countryId: country && country.uuid, availabilityFrom: startTimeStamp, availabilityTo: endTimeStamp, videoStatus };
}

/**
 *  Complete version of a medium. Locales includes.
 */
export function transformMedium ({ availabilities, number, auditInfo, type, defaultLocale, externalReference, uuid: id, publishStatus, defaultTitle, localeData }) {
  const seriesEntry = {
    availabilities: availabilities && availabilities.map(transformAvailability),
    number,
    basedOnDefaultLocale: {},
    description: {},
    startYear: {},
    title: {},
    locales: [],
    posterImage: {},
    profileImage: {},
    defaultLocale,
    externalReference,
    id,
    publishStatus,
    type,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, description, locale,
      posterImage, profileCover, startYear, title } of localeData) {
      seriesEntry.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      seriesEntry.description[locale] = description;
      seriesEntry.startYear[locale] = startYear;
      seriesEntry.title[locale] = title;
      seriesEntry.locales.push(locale);
      seriesEntry.profileImage[locale] = profileCover ? { id: profileCover.uuid, url: profileCover.url } : null;
      seriesEntry.posterImage[locale] = posterImage ? { id: posterImage.uuid, url: posterImage.url } : null;
    }
  }
  return seriesEntry;
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
  *   availabilityFrom: <date>,
  *   availabilityPlatforms: [<id>],
  *   availabilityTo: <date>,
  *   availabilityVideoStatusType: 'DISABLED' || 'SYNCABLE' || 'INTERACTIVE',
  *   basedOnDefaultLocale: { en: false, fr: true, nl: false },
  *   defaultLocale: 'en',
  *   description: { en: '...', fr: '...', nl: '...' },
  *   externalReference: '...',
  *   externalReferenceSource: '...',
  *   hasTitle: { en: true, fr: true, nl: true },
  *   id: 'abcdef123',
  *   keyVisual: { en: ..., fr: ..., nl: ... },
  *   locales: [ 'en', 'fr', 'nl' ],
  *   number: 2,
  *   poster: { en: ..., fr: ..., nl: ... },
  *   publishStatus: 'DRAFT' || 'REVIEW' || 'PUBLISHED',
  *   relatedCharacterIds: [ '1234', '1235', ... ]
  *   relatedVideoId: '1234',
  *   seasonId: 'abc12',
  *   seriesEntryId: 'bca12',
  *   title: { en: 'Pilot', fr: 'Pilot', nl: 'Pilot' }
  * }
  */
export function transformEpisode ({ availabilities, characters, contentProducers, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource },
  localeData, number, publishStatus, season, serie, uuid: id, video }) {
  const episode = {
    // ...convertAvailabilitiesFromApi(availabilities),
    basedOnDefaultLocale: {},
    contentProducerIds: contentProducers.map((cp) => cp.uuid),
    defaultLocale,
    description: {}, // Locale data
    externalReference,
    externalReferenceSource,
    hasTitle: {}, // Locale data
    id,
    keyVisual: {},
    locales: [],
    number,
    poster: {},
    publishStatus,
    relatedCharacterIds: characters.map((c) => c.character.uuid),
    relatedVideoId: video && video.uuid,
    seasonId: season.uuid,
    seriesEntryId: serie.uuid,
    title: {} // Locale data
  };
  for (const { basedOnDefaultLocale, description, hasTitle, locale, posterImage, profileCover, title } of localeData) {
    episode.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
    episode.description[locale] = description;
    episode.hasTitle[locale] = hasTitle;
    episode.keyVisual[locale] = profileCover ? { id: profileCover.uuid, url: profileCover.url } : null;
    episode.poster[locale] = posterImage ? { id: posterImage.uuid, url: posterImage.url } : null;
    episode.title[locale] = title;
    episode.locales.push(locale);
  }
  return episode;
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
  return { id, name, broadcaster: broadcaster && { id: broadcaster.uuid }, logo: logo && { url: logo.url } };
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
    avatar: avatar && { url: avatar.url } || {},
    profileImage: profileImage && { url: profileImage.url } || {},
    userStatus: disabled && ACTIVE || INACTIVE,
    languages,
    disabledReason,
    dateOfBirth,
    userName,
    email,
    firstName,
    lastName,
    gender,
    id };
}
