import { del, get, post } from './request';
import { transformPerson, transformListPerson } from './transformers';

// IMPORTANT
// Actors will be Persons in the future, so we will call this entity already Person,
// but on the backend this entity calls still Actor.

export async function fetchPersons (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/actors?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListPerson);
  return body;
}

// This file is copied from character and adjusted, but it is still postible that this function must be
// revised.
export async function persistPerson (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, publishStatus,
  personId, name }) {
  let character = {};
  if (personId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}`);
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
  return transformPerson(result.body);
}

export async function deletePerson (baseUrl, authenticationToken, locale, { personId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}`);
}

export async function deletePersons (baseUrl, authenticationToken, locale, { personIds }) {
  for (const personId of personIds) {
    await deletePerson(baseUrl, authenticationToken, locale, { personId });
  }
}

export async function searchPersons (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25 }) {
  let url = `${baseUrl}/v004/media/actors?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListPerson);
}
