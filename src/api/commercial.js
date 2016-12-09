import { del, get, post, postFormData } from './request';
import { transformListCommercial, transformCommercial } from './transformers';

export async function fetchCommercials (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/commercials?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
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
  basedOnDefaultLocale, broadcasters, characters, contentProducers, defaultLocale,
  defaultTitle, description, endYear, episodeId, hasTitle, locales, number,
  publishStatus, relatedCharacterIds, seasonId, seriesEntryId, startYear, title,
  lastCommercialId
}) {
  let episode = {};
  if (episodeId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/serieCommercials/${episodeId}`);
    episode = body;
  }
  // episode.characters = characters.map(({ id }) => ({ character: { uuid: id } }));
  // episode.categories = mediumCategories.map((mediumCategoryId) => ({ uuid: mediumCategoryId }));
  episode.contentProducers = contentProducers && contentProducers.map((cp) => ({ uuid: cp }));
  episode.broadcasters = broadcasters && broadcasters.map((bc) => ({ uuid: bc }));
  episode.defaultLocale = defaultLocale;
  episode.defaultTitle = defaultTitle;
  // episode.externalReference.reference = externalReference;
  // episode.externalReference.source = externalReferenceSource;
  episode.publishStatus = publishStatus;
  episode.season = { uuid: seasonId };
  episode.serie = { uuid: seriesEntryId };
  episode.type = 'TV_SERIE_SEASON';
  episode.number = number;
  // Update locale data.
  episode.localeData = episode.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    // Get localeData, create if necessary in O(n^2)
    let localeData = episode.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      episode.localeData.push(localeData);
    }
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    localeData.endYear = endYear && endYear[locale];
    localeData.startYear = startYear && startYear[locale];
    localeData.hasTitle = hasTitle && hasTitle[locale];
    localeData.title = title && title[locale];
  });
  const url = `${baseUrl}/v004/media/serieCommercials`;
  const result = await post(authenticationToken, locale, url, episode);
  const persistedCommercial = transformCommercial(result.body);
  // Copy all characters of the last episode of a season. This only happens when
  // we create a new episode. We need to create the episode first, so we have the
  // id of this episode. After that we can do the copy call.
  if (lastCommercialId) {
    const resp = await post(authenticationToken, locale, `${baseUrl}/v004/media/media/${persistedCommercial.id}/castMembers/actions/importFromOtherMedium/${lastCommercialId}`);
    console.log('result', resp);
  }
  return persistedCommercial;
}

export async function deleteCommercial (baseUrl, authenticationToken, locale, { episodeId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/serieCommercials/${episodeId}`);
}

export async function deleteCommercials (baseUrl, authenticationToken, locale, { episodeIds }) {
  for (const episodeId of episodeIds) {
    await deleteCommercial(baseUrl, authenticationToken, locale, { episodeId });
  }
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { episodeId, image, callback }) {
  const formData = new FormData();
  formData.append('uuid', episodeId);
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${episodeId}/profileCover`, formData, callback);
}

export async function uploadPosterImage (baseUrl, authenticationToken, locale, { episodeId, image, callback }) {
  const formData = new FormData();
  formData.append('uuid', episodeId);
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/media/${episodeId}/posterImage`, formData, callback);
}
