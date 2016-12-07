import { del, get, post } from './request';
import { transformActor, transformListActor } from './transformers';

export async function fetchActors (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/actors?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListActor);
  return body;
}

// This file is copied from character and adjusted, but it is still postible that this function must be
// revised.
export async function persistActor (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, publishStatus,
  actorId, name }) {
  let character = {};
  if (actorId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/actors/${actorId}`);
    character = body;
  }

  character.defaultLocale = defaultLocale;
  character.publishStatus = publishStatus;

  // Update locale data.
  character.localeData = character.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = character.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      character.localeData.push(localeData);
    }
    // basedOnDefaultLocale is always provided, no check needed
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
    // title is always provided, no check needed
    localeData.name = name[locale];
  });
  const url = `${baseUrl}/v004/media/actors`;
  const result = await post(authenticationToken, locale, url, character);
  return transformActor(result.body);
}

export async function deleteActor (baseUrl, authenticationToken, locale, { actorId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/actors/${actorId}`);
}

export async function deleteActors (baseUrl, authenticationToken, locale, { actorIds }) {
  for (const actorId of actorIds) {
    await deleteActor(baseUrl, authenticationToken, locale, { actorId });
  }
}

export async function searchActors (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25 }) {
  let url = `${baseUrl}/v004/media/actors?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListActor);
}
