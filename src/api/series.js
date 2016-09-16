import * as request from './request';

function transformSeries ({ categories, characters, defaultLocale,
  externalReference: { reference: externalReference, source: externalReferenceSource },
  localeData, publishStatus, uuid: id }) {
  const series = {
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
    title: {} // Locale data
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

/**
  * @returnExample
  * {
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

/**
 * GET /media/series?searchString=...
 * Search for series.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param {string} [data.searchString=''] The string to search products on.
 * @throws UnauthorizedError
 * @throws UnexpectedError
 */
export async function searchSeries (baseUrl, authenticationToken, locale, { searchString = '' }) {
  // TODO: Use media instead of series.
  let searchUrl = `${baseUrl}/v003/media/series?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await request.get(authenticationToken, locale, searchUrl);
  return data.map(transformSeries);
}
