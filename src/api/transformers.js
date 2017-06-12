import { ACTIVE, ADMIN, BRAND_REPRESENTATIVE, BROADCASTER, CONTENT_MANAGER, CONTENT_PRODUCER, INACTIVE } from '../constants/userRoles';
import moment from 'moment';

export function transformImage (image) {
  if (image) {
    const { dimension, url, uuid: id } = image;
    return { id, dimension, url };
  }
}

export function transformListBrand ({ uuid, name, auditInfo, logo, profileCover }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: transformImage(logo),
    profileImage: transformImage(profileCover),
    name
  };
}

export function transformListProduct ({ affiliate, auditInfo, brand, fullName, image: logo,
  noLongerAvailable, publishStatus, relevance, shortName, used, uuid }) {
  return {
    affiliate,
    brand: brand && transformListBrand(brand),
    createdOn: auditInfo && auditInfo.createdOn,
    fullName,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: transformImage(logo),
    noLongerAvailable,
    publishStatus,
    relevance,
    shortName
  };
}

export function transformSimilarProduct ({ uuid, product1, product2 }) {
  return {
    id: uuid,
    product1: transformListProduct(product1),
    product2: transformListProduct(product2)
  };
}

export function transformTag ({ uuid, publishStatus, defaultLocale, localeData, auditInfo }) {
  const tag = {
    basedOnDefaultLocale: {},
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    description: {},
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    locales: [],
    name: {}
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, locale, name } of localeData) {
      tag.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      tag.name[locale] = name;
      tag.locales.push(locale);
    }
  }
  return tag;
}

export function transformListTag ({ uuid, name, auditInfo, logo }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    name
  };
}

export function transformListTopic ({ hidden, icon, readOnly, sourceBrand, sourceCharacter,
  sourceMedium, sourcePerson, sourceReference, sourceType, text, uuid }) {
  return {
    hidden,
    icon: transformImage(icon),
    id: uuid,
    readOnly,
    sourceBrand,
    sourceCharacter,
    sourceMedium,
    sourcePerson,
    sourceReference,
    sourceType,
    text
  };
}

export function transformBroadcaster ({ logo, name, uuid }) {
  return { logo: logo && { id: logo.uuid, url: logo.url }, name, id: uuid };
}

export function transformDatalabeltype ({ auditInfo, name, uuid }) {
  return { name, id: uuid, createdBy: auditInfo.createdBy, createdOn: auditInfo.createdOn };
}

export function transformSingleDatalabeltype ({ uuid, defaultLocale, localeData, auditInfo }) {
  const datalabeltype = {
    basedOnDefaultLocale: {},
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    locales: [],
    name: {}
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, locale, name } of localeData) {
      datalabeltype.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      datalabeltype.name[locale] = name;
      datalabeltype.locales.push(locale);
    }
  }
  return datalabeltype;
}

export function transformDatalabel ({ auditInfo, name, uuid, type }) {
  return { name, id: uuid, createdBy: auditInfo.createdBy, createdOn: auditInfo.createdOn, type: type.name };
}

export function transformSingleDatalabel ({ uuid, defaultLocale, localeData, auditInfo, type }) {
  const datalabel = {
    basedOnDefaultLocale: {},
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    locales: [],
    name: {},
    type: type.uuid
  };

  if (localeData) {
    for (const { basedOnDefaultLocale, locale, name } of localeData) {
      datalabel.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      datalabel.name[locale] = name;
      datalabel.locales.push(locale);
    }
  }

  return datalabel;
}

export function transformContentProducer ({ uuid, name, auditInfo, logo }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: transformImage(logo),
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
      brand.logo[locale] = transformImage(logo);
      brand.profileImage[locale] = transformImage(profileCover);
      brand.tagLine[locale] = tagLine;
      brand.locales.push(locale);
    }
  }
  return brand;
}

export function transformShop ({ defaultLocale, localeData, publishStatus, universalBasketEnabled, uuid, countries }) {
  const shop = {
    basedOnDefaultLocale: {},
    countries,
    defaultLocale,
    description: {},
    id: uuid,
    locales: [],
    logo: {},
    universalBasketEnabled,
    url: {},
    publishStatus,
    name: {}
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, logo, locale, name, url } of localeData) {
      shop.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      shop.name[locale] = name;
      shop.url[locale] = url;
      shop.logo[locale] = transformImage(logo);
      shop.locales.push(locale);
    }
  }
  return shop;
}

export function transformProduct ({ affiliate, auditInfo, brand, categories, defaultLocale,
  localeData, noLongerAvailable, publishStatus, tags, uuid }) {
  const product = {
    affiliate,
    basedOnDefaultLocale: {},
    brand: brand && transformListBrand(brand),
    categories: categories && categories.map((category) => category.uuid),
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    description: {},
    fullName: {},
    id: uuid,
    images: {},
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    locales: [],
    logo: {},
    noLongerAvailable,
    profileImage: {},
    publishStatus,
    shortName: {},
    tags: tags && tags.map((tag) => tag.uuid)
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, description, images, locale, shortName, fullName, profileCover } of localeData) {
      product.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      product.description[locale] = description;
      product.shortName[locale] = shortName;
      product.fullName[locale] = fullName;
      product.logo[locale] = images && transformImage(images[0]);
      product.images[locale] = images && images.map(transformImage);
      product.profileImage[locale] = transformImage(profileCover);
      product.locales.push(locale);
    }
  }
  return product;
}

export function transformListShop ({ auditInfo, uuid, logo, name, profileCover,
  publishStatus, universalBasketEnabled }) {
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    logo: transformImage(logo),
    name,
    publishStatus,
    universalBasketEnabled
  };
}

export function transformProductOffering ({ uuid, affiliateInfo, buyUrl, locale,
  noLongerAvailable, price, product, productUrl, shop }) {
  return {
    affiliateCode: affiliateInfo && affiliateInfo.code,
    buyUrl,
    id: uuid,
    locale,
    noLongerAvailable,
    price: price && { amount: price.amount, currency: price.currency },
    product: product && transformListProduct(product),
    productUrl,
    shop: shop && transformListShop(shop)
  };
}

export function transformBrandSubscription ({
  brand: { logo, name, uuid: brandId },
  count
}) {
  return {
    brand: {
      name,
      logo: transformImage(logo),
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
      portraitImage: transformImage(portraitImage),
      id: characterId
    },
    count,
    medium: { id: mediumId, title }
  };
}

export function transformListMediumCategory ({ name, uuid: id }) {
  return { name, id };
}

export function transformListPushNotificationDestination ({ description: name, type: id }) {
  return { name, id };
}

export function transformMediumCategory ({ uuid: id, localeData }) {
  const mediumCategory = {
    locales: [],
    id,
    name: {}
  };
  if (localeData) {
    for (const { name, locale } of localeData) {
      mediumCategory.name[locale] = name;
      mediumCategory.locales.push(locale);
    }
  }
  return mediumCategory;
}

export const transformListProductCategory = transformListMediumCategory;
export const transformProductCategory = transformMediumCategory;

/**
 *  Light version of a medium. No locales includes.
 */
export function transformListMedium ({ number, publishStatus, auditInfo, title, type, posterImage, profileImage, roundLogo, uuid: id, season, serie }) {
  return {
    id,
    title,
    type,
    number,
    publishStatus,
    season: season && transformListMedium(season),
    serie: serie && transformListMedium(serie),
    posterImage: transformImage(posterImage),
    profileImage: transformImage(profileImage),
    roundLogo: transformImage(roundLogo),
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
}

/**
 *  Light version of a commercial. No locales includes.
 */
export function transformListCommercials ({ number, publishStatus, auditInfo, title, type, posterImage, profileImage, roundLogo, uuid: id }) {
  return {
    id,
    title,
    type,
    number,
    publishStatus,
    posterImage: transformImage(posterImage),
    profileImage: transformImage(profileImage),
    roundLogo: transformImage(roundLogo),
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy
  };
}

/**
 *  Light version of a push notification. No locales includes.
 */
export function transformPushNotification ({ uuid: id, type, applications, pushOn, publishStatus, pushWindowStart, pushWindowSizeInMinutes, pushedOn, localeData, defaultLocale, action, payload, audienceFilter, auditInfo }) {
  const pushNotification = {
    id,
    type,
    pushOn,
    publishStatus,
    pushWindowStart,
    retryDuration: pushWindowSizeInMinutes,
    pushedOn,
    actionType: action && action.type,
    basedOnDefaultLocale: {},
    defaultLocale,
    locales: [],
    payloadType: payload && payload.type || {},
    payloadData: payload && payload.data || {},
    createdBy: auditInfo && auditInfo.createdBy,
    createdOn: auditInfo && auditInfo.createdOn,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    registeredUser: audienceFilter && audienceFilter.registeredUser,
    unRegisteredUser: audienceFilter && audienceFilter.unRegisteredUser,
    seriesEntryId: audienceFilter && audienceFilter.subscriptions && audienceFilter.subscriptions[0] && audienceFilter.subscriptions[0].uuid
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, payload: { data, type }, locale } of localeData) {
      pushNotification.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      pushNotification.payloadData[locale] = data || '-';
      pushNotification.payloadType[locale] = type;
      pushNotification.locales.push(locale);
    }
  }
  pushNotification.applications = [ 'IOS', 'ANDROID' ].map((deviceType) => {
    let application = (applications || []).filter((app) => app.deviceType === deviceType)[0];
    if (application) {
      application.deviceSelected = true;
    } else {
      application = { deviceType, deviceSelected: false };
    }
    return application;
  });

  // const sendDate = new Date(pushOn);
  const sendDate = pushWindowStart ? new Date(pushWindowStart) : new Date();

  pushNotification.sendDate = moment(sendDate).startOf('day');
  pushNotification.sendTime = moment(sendDate);
  // pushNotification.sendTime = dateItems[1];
  return pushNotification;
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
    profileImage: transformImage(profileCover),
    portraitImage: transformImage(portraitImage),
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
    profileImage: transformImage(profileCover),
    portraitImage: transformImage(portraitImage),
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
  auditInfo, type, defaultLocale, externalReference: { reference: externalReference, source: externalReferenceSource },
  live, serie, season, uuid: id, publishStatus,
  defaultTitle, localeData, video, categories: mediumCategories }) {
  const medium = {
    availabilities: availabilities && availabilities.map(transformAvailability),
    basedOnDefaultLocale: {},
    brand: brand && transformListBrand(brand),
    broadcasters: broadcasters && broadcasters.map(transformBroadcaster),
    characters: characters && characters.map(transformListCharacter),
    contentProducers: contentProducers && contentProducers.map(transformContentProducer),
    defaultLocale,
    description: {},
    endYear: {},
    externalReference,
    externalReferenceSource,
    hasTitle: {},
    id,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    live,
    locales: [],
    mediumCategories: mediumCategories && mediumCategories.map((mc) => mc.uuid),
    number,
    posterImage: {},
    profileImage: {},
    publishStatus,
    roundLogo: {},
    season: season && { title: season.title, id: season.uuid },
    seriesEntry: serie && { title: serie.title, id: serie.uuid },
    startYear: {},
    subTitle: {},
    title: {},
    type,
    videoId: video && video.uuid
  };
  if (localeData) {
    for (const { hasTitle, basedOnDefaultLocale, description, locale,
      posterImage, profileCover, roundLogo, endYear, startYear, title, subTitle } of localeData) {
      medium.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      medium.description[locale] = description;
      medium.startYear[locale] = startYear;
      medium.endYear[locale] = endYear;
      medium.hasTitle[locale] = hasTitle;
      medium.title[locale] = title;
      medium.subTitle[locale] = subTitle;
      medium.profileImage[locale] = transformImage(profileCover);
      medium.posterImage[locale] = transformImage(posterImage);
      medium.roundLogo[locale] = transformImage(roundLogo);
      medium.locales.push(locale);
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
      posterImage: transformImage(posterImage),
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
      image: transformImage(image),
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

// export function transformActivityData (dataList, transformer) {
//   const res = {};
//   for (const { data, medium } of dataList) {
//     res[medium.uuid] = transformer(data);
//   }
//   return res;
// }

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
    season.keyVisual[locale] = transformImage(profileCover);
    season.poster[locale] = transformImage(posterImage);
    season.locales.push(locale);
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
  commercial.bannerDirectLink = data.bannerDirectLink;
  commercial.hasBanner = data.hasBanner;
  commercial.bannerExternalLink = {};
  commercial.bannerImage = {};
  commercial.bannerLogo = {};

  const { bannerLinkType, bannerActor, bannerBrand, bannerCharacter, bannerMedium, localeData } = data;

  commercial.bannerActor = bannerActor && transformListPerson(bannerActor);
  commercial.bannerBrand = bannerBrand && transformListBrand(bannerBrand);
  commercial.bannerCharacter = bannerCharacter && transformListCharacter(bannerCharacter);
  commercial.bannerMedium = bannerMedium && transformListMedium(bannerMedium);

  if (bannerLinkType === 'EXTERNAL') {
    commercial.bannerSystemLinkType = 'EXTERNAL';
  } else {
    commercial.bannerSystemLinkType = 'INTERNAL';
    commercial.bannerInternalLinkType = bannerLinkType;
  }

  for (const { bannerExternalLink, bannerImage, locale } of localeData) {
    commercial.bannerImage[locale] = transformImage(bannerImage);
    commercial.bannerExternalLink[locale] = bannerExternalLink;
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
    logo: transformImage(logo),
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
  const brands = [];
  const broadcasters = [];
  const contentProducers = [];
  roles && roles.map((role) => {
    switch (role.role) {
      case ADMIN:
        obj.sysAdmin = true;
        break;
      case BRAND_REPRESENTATIVE:
        obj.brand = true;
        brands.push(role.context.uuid);
        break;
      case BROADCASTER:
        obj.broadcaster = true;
        broadcasters.push(role.context.uuid);
        break;
      case CONTENT_MANAGER:
        obj.contentManager = true;
        break;
      case CONTENT_PRODUCER:
        obj.contentProducer = true;
        contentProducers.push(role.context.uuid);
        break;
    }
  });
  return {
    ...obj,
    brands,
    broadcasters,
    contentProducers,
    avatar: transformImage(avatar),
    profileImage: transformImage(profileImage),
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
    image: transformImage(image),
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
    medium: {
      profileImage: transformImage(profileImage)
    },
    scenes: scenes && scenes.map(transformScene),
    totalDurationInSeconds,
    videoFilename
  };
}

export function transformListCollection ({
  auditInfo, linkType, linkedBrand, linkedCharacter, localeData, medium,
  recurring, recurringEntries, sortOrder, title, uuid, visible
}) {
  return {
    brand: linkedBrand && transformListBrand(linkedBrand),
    character: linkedCharacter && transformListCharacter(linkedCharacter),
    createdOn: auditInfo && auditInfo.createdOn,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    linkType,
    mediumId: medium && medium.uuid,
    recurring,
    recurringEntries,
    sortOrder,
    title,
    visible
  };
}

export function transformCollection ({
  auditInfo, linkType, linkedBrand, linkedCharacter, defaultLocale,
  localeData, medium, recurring, recurringEntries, sortOrder, uuid, visible
}) {
  const collection = {
    basedOnDefaultLocale: {},
    brand: linkedBrand && transformListBrand(linkedBrand),
    character: linkedCharacter && transformListCharacter(linkedCharacter),
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    id: uuid,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    linkType,
    locales: [],
    mediumId: medium && medium.uuid,
    recurring,
    recurringEntries,
    title: {},
    visible
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, locale, title } of localeData) {
      collection.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      collection.title[locale] = title;
      collection.locales.push(locale);
    }
  }
  return collection;
}

export function transformListCollectionItem ({ product, productRelevance, uuid }) {
  return {
    id: uuid,
    product: transformListProduct(product),
    relevance: productRelevance
  };
}

export function transformScheduleEntry ({ broadcaster, channels, commercial, end, media, start, uuid }) {
  return {
    broadcaster: broadcaster && transformBroadcaster(broadcaster),
    broadcastChannels: channels.map(transformBroadcastChannel),
    commercialId: commercial && commercial.uuid,
    end,
    id: uuid,
    media: media.map(transformListMedium),
    start
  };
}

export function transformCountry ({ name, uuid: id }) {
  return { id, name };
}

export function transformLanguage ({ name, uuid: id }) {
  return { id, name };
}

export function transformAudience ({ countries, languages, name, uuid }) {
  return {
    countries: countries && countries.map(transformCountry),
    id: uuid,
    languages: languages && languages.map(transformLanguage),
    name
  };
}

export function transformTopic ({ icon, profileImage, readOnly, sourceMedium, sourceReference, sourceType, text, uuid }) {
  return {
    icon: transformImage(icon),
    id: uuid,
    profileImage: transformImage(profileImage),
    readOnly,
    sourceMedium,
    sourceReference,
    sourceType,
    text
  };
}

export function transformListCrop ({ area, auditInfo, post: {
  auditInfo: { lastUpdatedBy: postLastUpdatedBy, lastUpdatedOn: postLastUpdatedOn },
  comment, image, promoted, publishStatus, title, topics, uuid: postUuid }, scene, uuid }) {
  return {
    comment,
    createdBy: auditInfo && auditInfo.createdBy,
    createdOn: auditInfo && auditInfo.createdOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    id: uuid,
    image: transformImage(image),
    postId: postUuid,
    postLastUpdatedBy,
    postLastUpdatedOn,
    publishStatus,
    promoted,
    region: {
      height: area.height,
      width: area.width,
      x: area.x,
      y: area.y
    },
    title,
    topics: topics && topics.map(transformTopic)
  };
}

export function transformCrop ({ area, auditInfo, post: { defaultLocale, image, localeData, promoted, publishStatus, title, topics }, scene, uuid }) {
  const crop = {
    basedOnDefaultLocale: {},
    comment: {},
    createdBy: auditInfo && auditInfo.createdBy,
    createdOn: auditInfo && auditInfo.createdOn,
    defaultLocale,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    id: uuid,
    image: transformImage(image),
    locales: [],
    publishStatus,
    promoted,
    region: {
      height: area.height,
      width: area.width,
      x: area.x,
      y: area.y
    },
    sceneId: scene && scene.uuid,
    title: {},
    topics: topics && topics.map(transformTopic)
  };

  if (localeData) {
    for (const { basedOnDefaultLocale, comment, locale, title } of localeData) {
      crop.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      crop.comment[locale] = comment;
      crop.title[locale] = title;
      crop.locales.push(locale);
    }
  }
  return crop;
}

export function transformListSpott ({ auditInfo, comment, image, promoted, publishStatus, source, title, topics, uuid }) {
  return {
    comment,
    createdBy: auditInfo && auditInfo.createdBy,
    createdOn: auditInfo && auditInfo.createdOn,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    sourceMedium: source && source.medium && transformListMedium(source.medium),
    id: uuid,
    image: transformImage(image),
    promoted,
    publishStatus,
    title,
    topics: topics && topics.map(transformTopic)
  };
}

function transformPersonMarker ({ character, person, point, uuid }) {
  if (character) {
    return {
      character: transformListCharacter(character),
      entityType: 'CHARACTER',
      id: uuid,
      point
    };
  }
  if (person) {
    return {
      entityType: 'PERSON',
      id: uuid,
      person: transformListPerson(person),
      point
    };
  }
}

function transformProductMarker ({ character, person, point, product, relevance, uuid }) {
  let productCharacter = null;
  if (character) {
    productCharacter = { entityType: 'CHARACTER', id: character.uuid };
  }
  if (person) {
    productCharacter = { entityType: 'PERSON', id: person.uuid };
  }
  return {
    entityType: 'PRODUCT',
    id: uuid,
    point,
    product: transformListProduct(product),
    productCharacter,
    relevance
  };
}

export function transformSpott ({
  auditInfo, defaultLocale, image, imageSource, localeData, personMarkers, productMarkers,
  publishStatus, promoted, promotedForBrand, topics, uuid, author, source
}) {
  const spott = {
    author: author && transformUser(author),
    basedOnDefaultLocale: {},
    createdBy: auditInfo && auditInfo.createdBy,
    createdOn: auditInfo && auditInfo.createdOn,
    comment: {},
    defaultLocale,
    id: uuid,
    image: transformImage(image),
    imageSource,
    lastUpdatedBy: auditInfo && auditInfo.lastUpdatedBy,
    lastUpdatedOn: auditInfo && auditInfo.lastUpdatedOn,
    locales: [],
    promoted,
    promotedForBrand: promotedForBrand && transformListBrand(promotedForBrand),
    tags: personMarkers.map(transformPersonMarker).concat(productMarkers.map(transformProductMarker)),
    title: {},
    topics: (topics || []).map(transformTopic),
    publishStatus,
    source: source.medium ? { medium: source.medium } : {}
  };
  if (localeData) {
    for (const { basedOnDefaultLocale, comment, locale, title } of localeData) {
      spott.basedOnDefaultLocale[locale] = basedOnDefaultLocale;
      spott.comment[locale] = comment;
      spott.title[locale] = title;
      spott.locales.push(locale);
    }
  }
  return spott;
}

export function transformTopMedia ({ medium, subscriptionCount, taggedProductCount }) {
  return {
    id: medium.uuid,
    medium: transformListMedium(medium),
    subscriptionCount,
    taggedProductCount
  };
}

export function transformTopCommercials ({ commercial, syncs, bannerClicks }) {
  return {
    id: commercial.uuid,
    commercial: transformListCommercials(commercial),
    syncs,
    bannerClicks
  };
}

export function transformTopPeople ({ character, subscriptionCount, taggedProductCount }) {
  return {
    id: character.uuid,
    character: transformListCharacter(character),
    subscriptionCount,
    taggedProductCount
  };
}

export function transformTopProduct ({ buys, clicks, impressions, product, sales }) {
  return {
    buys,
    clicks,
    id: product.uuid,
    product: transformListProduct(product),
    sales: sales && { amount: sales.amount, currency: sales.currency }
  };
}

export function transformKeyMetrics ({ brandSubscriptions, productBuys, productConversionRatePercentage, productImpressions, productViews, taggedProductCount }) {
  return {
    brandSubscriptions,
    productBuys,
    productConversionRatePercentage,
    productImpressions,
    productViews,
    taggedProductCount
  };
}

export function transformAgeRange ({ ageRange: { from, to }, value }) {
  return {
    label: to ? `${from}-${to}` : `${from}+`,
    value
  };
}

export function transformVideoProcessor ({ auditInfo, description, inputFileName, requestId, status }) {
  // inputFileName also contains a path , we only need the fileName.
  const fileNameStrings = inputFileName.split('/');
  const fileName = fileNameStrings[fileNameStrings.length - 1];
  return {
    createdOn: auditInfo && auditInfo.createdOn,
    createdBy: auditInfo && auditInfo.createdBy,
    description,
    fileName: fileName && fileName,
    id: requestId && requestId.uuid,
    status
  };
}
