import { del, get, post } from './request';
import { transformSeason004, transformEpisode, transformListEpisode } from './transformers';

export async function fetchSeasonEpisodes (baseUrl, authenticationToken, locale, { seasonId, searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/serieSeasons/${seasonId}/episodes?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformListEpisode);
  return body;
}

export async function searchEpisodes (baseUrl, authenticationToken, locale, { searchString, seasonId }) {
  if (!seasonId) {
    return [];
  }
  let searchUrl = `${baseUrl}/v003/media/serieSeasons/${seasonId}/episodes?pageSize=30`;
  if (searchString) {
    searchUrl += `&searchString=${encodeURIComponent(searchString)}`;
  }
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformEpisode);
}

export async function fetchSeasons (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/serieSeasons?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformSeason004);
  return body;
}

export async function fetchSeason (baseUrl, authenticationToken, locale, { seasonId }) {
  const url = `${baseUrl}/v004/media/serieSeasons/${seasonId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformSeason004(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistSeason (baseUrl, authenticationToken, locale, { number, hasTitle, basedOnDefaultLocale,
  locales, description, endYear, startYear, defaultLocale, defaultTitle, seriesEntryId, title, seasonId }) {
  let season = {};
  if (seasonId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/serieSeasons/${seasonId}`);
    season = body;
  }
  // series.availabilities = transformAvailabilitiesToApi(availabilityFrom, availabilityTo, availabilityPlannedToMakeInteractive, availabilityPlatforms, availabilityVideoStatusType);
  // series.categories = mediumCategories.map((mediumCategoryId) => ({ uuid: mediumCategoryId }));
  season.defaultLocale = defaultLocale;
  season.defaultTitle = defaultTitle;
  // series.externalReference.reference = externalReference;
  // series.externalReference.source = externalReferenceSource;
  // series.publishStatus = publishStatus;
  season.serie = { uuid: seriesEntryId };
  season.type = 'TV_SERIE_SEASON';
  season.number = number;

  // Update locale data.
  season.localeData = season.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    // Get localeData, create if necessary in O(n^2)
    let localeData = season.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      season.localeData.push(localeData);
    }
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    localeData.endYear = endYear && endYear[locale];
    localeData.startYear = startYear && startYear[locale];
    localeData.hasTitle = hasTitle && hasTitle[locale];
    // title is always provided, no check needed
    localeData.title = title && title[locale];
  });
  const url = `${baseUrl}/v004/media/serieSeasons`;
  await post(authenticationToken, locale, url, season);
}

export async function deleteSeason (baseUrl, authenticationToken, locale, { seasonId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/serieSeasons/${seasonId}`);
}

export async function deleteSeasons (baseUrl, authenticationToken, locale, { seasonIds }) {
  for (const seasonId of seasonIds) {
    await deleteSeason(baseUrl, authenticationToken, locale, { seasonId });
  }
}
