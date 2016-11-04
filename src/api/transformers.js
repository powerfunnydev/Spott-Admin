
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

export function transformListMedium ({ title, type, posterImage, profileImage, uuid: id }) {
  return {
    id,
    title,
    type,
    posterImage: posterImage && { id: posterImage.uuid, url: posterImage. url },
    profileImage: profileImage && { id: profileImage.uuid, url: profileImage. url }
  };
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
  *   seriesId: 'bca12',
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
    seriesId: serie.uuid,
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
  *   seriesId: 'abc123',
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
    seriesId: serie.uuid,
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

export function transformBroadcastChannel ({ name, uuid: id, logo, broadcaster }) {
  return { id, name, broadcaster: broadcaster && { id: broadcaster.uuid }, logo: logo && { url: logo.url } };
}

export function transformTvGuideEntry ({ auditInfo: { lastUpdatedBy, lastUpdatedOn }, uuid: id, start, end, medium, medium: { season }, channel }) {
  return {
    start, end, id, lastUpdatedBy, lastUpdatedOn,
    medium: transformListMedium(medium),
    channel: transformBroadcastChannel(channel),
    season: season && { title: season.title },
    serie: season && season.serie && { title: season.serie.title }
  };
}

export function transformSingleTvGuideEntry ({ auditInfo: { lastUpdatedBy, lastUpdatedOn }, uuid: id, start, end,
  medium: { uuid: mediumUuid }, mediumInfo, mediumInfo: { season }, channel: { uuid: channelUuid }, channelInfo }) {
  return {
    start, end, id, lastUpdatedBy, lastUpdatedOn,
    medium: { ...transformListMedium(mediumInfo), id: mediumUuid },
    channel: { ...transformBroadcastChannel(channelInfo), id: channelUuid },
    season: season && { id: season.uuid, title: season.title },
    serie: season && season.serie && { id: season.serie.uuid, title: season.serie.title }
  };
}

export function transformPaging ({ page, pageCount, pageSize, totalResultCount }) {
  return { page, pageCount, pageSize, totalResultCount };
}
