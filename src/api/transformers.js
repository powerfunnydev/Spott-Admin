import { transformAvailabilitiesFromApi } from './_helpers';

export function transformContentProducers (body) {
  const contentProducers = body.data;
  const data = [];
  for (const cp of contentProducers) {
    const newCp = {};
    newCp.id = cp.uuid;
    newCp.name = cp.name;
    newCp.createdOn = cp.auditInfo.createdOn;
    newCp.lastUpdatedBy = cp.auditInfo.lastUpdatedBy;
    newCp.lastUpdatedOn = cp.auditInfo.lastUpdatedOn;
    data.push(newCp);
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

export function transformMedium ({ title, type, posterImage, profileImage, uuid: id }) {
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
  *   availabilityPlannedToMakeInteractive: <bool>,,
  *   availabilityPlatforms: [<id>],
  *   availabilityTo: <date>,
  *   availabilityVideoStatusType: 'DISABLED' || 'SYNCABLE' || 'INTERACTIVE',
  *   basedOnDefaultLocale: { en: false, fr: true, nl: false },
  *   mediumCategories: [ '123', '124', '1235' ],
  *   defaultLocale: 'en',
  *   description: { en: 'Home', fr: 'A la maison', nl: 'Thuis' },
  *   externalReference: '...',
  *   externalReferenceSource: '...',
  *   id: 'abcdef123',
  *   locales: [ 'en', 'fr', 'nl' ],
  *   poster: { en: ..., fr: ..., nl: ... }
  *   publishStatus: 'DRAFT' || 'REVIEW' || 'PUBLISHED',
  *   relatedCharacterIds: [ '1234', '1235', ... ],
  *   keyVisual: { en: ..., fr: ..., nl: ... },
  *   startYear: { en: 1991, fr: 1991, nl: 1991 },
  *   endYear: { en: 2000, fr: 2000, nl: 2000 },
  *   title: { en: 'Home', fr: 'A la maison', nl: 'Thuis' }
  * }
  */
export function transformSeries ({ availabilities, categories, characters, defaultLocale,
  externalReference: { reference: externalReference, source: externalReferenceSource },
  localeData, publishStatus, type, uuid: id }) {
  const series = {
    ...transformAvailabilitiesFromApi(availabilities),
    basedOnDefaultLocale: {},
    mediumCategories: categories.map((mediumCategory) => mediumCategory.uuid),
    defaultLocale,
    description: {}, // Locale data
    externalReference,
    externalReferenceSource,
    id,
    locales: [],
    keyVisual: {},
    publishStatus,
    poster: {},
    relatedCharacterIds: characters.map((c) => c.character.uuid),
    startYear: {}, // Locale data
    endYear: {}, // Locale data
    title: {}, // Locale data
    type
  };
  for (const { basedOnDefaultLocale, description, endYear, locale, posterImage, profileCover, startYear, title } of localeData) {
    series.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
    series.description[locale] = description;
    series.endYear[locale] = endYear;
    series.keyVisual[locale] = profileCover ? { id: profileCover.uuid, url: profileCover.url } : null;
    series.poster[locale] = posterImage ? { id: posterImage.uuid, url: posterImage.url } : null;
    series.startYear[locale] = startYear;
    series.title[locale] = title;
    series.locales.push(locale);
  }
  return series;
}
