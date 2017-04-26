import { del, get, post, postFormData } from './request';
import { transformPerson, transformListPerson, transformImage } from './transformers';

// IMPORTANT
// Actors will be Persons in the future, so we will call this entity already Person,
// but on the backend this entity calls still Actor.

export async function fetchPersons (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/actors?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListPerson);
  return body;
}

export async function fetchPerson (baseUrl, authenticationToken, locale, { personId }) {
  const url = `${baseUrl}/v004/media/actors/${personId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformPerson(body);
  return result;
}

export async function fetchFaceImages (baseUrl, authenticationToken, locale, { personId, sortDirection = 'DESC', sortField = 'ADDED_ON' }) {
  const url = `${baseUrl}/v004/media/actors/${personId}/faceImages?sortDirection=${sortDirection}&sortField=${sortField}`;
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(({ image, uuid }) => {
    const faceImage = transformImage(image);
    faceImage.id = uuid;
    return faceImage;
  });
  return body;
}

// This file is copied from character and adjusted, but it is still postible that this function must be
// revised.
export async function persistPerson (baseUrl, authenticationToken, locale, {
  basedOnDefaultLocale, defaultLocale, description, locales, publishStatus,
  personId, fullName, gender, dateOfBirth, placeOfBirth }) {
  let person = {};
  if (personId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}`);
    person = body;
  }

  person.defaultLocale = defaultLocale;
  person.publishStatus = publishStatus;
  person.gender = gender;
  person.fullName = fullName;
  person.dateOfBirth = dateOfBirth && dateOfBirth.format();
  person.placeOfBirth = placeOfBirth;

  // Update locale data.
  person.localeData = person.localeData || []; // Ensure we have locale data
  locales.forEach((locale) => {
    let localeData = person.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      person.localeData.push(localeData);
    }
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
    localeData.description = description && description[locale];
  });
  const url = `${baseUrl}/v004/media/actors`;
  const result = await post(authenticationToken, locale, url, person);
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
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListPerson);
}

export async function uploadProfileImage (baseUrl, authenticationToken, locale, { personId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}/profileCover`, formData, callback);
  return transformPerson(result.body);
}

export async function uploadPortraitImage (baseUrl, authenticationToken, locale, { personId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}/portraitImage`, formData, callback);
  return transformPerson(result.body);
}

export async function uploadFaceImage (baseUrl, authenticationToken, locale, { personId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  await postFormData(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}/faceImages`, formData, callback);
}

export async function deleteFaceImage (baseUrl, authenticationToken, locale, { personId, faceImageId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/actors/${personId}/faceImages/${faceImageId}`);
}

export async function deletePortraitImage (baseUrl, authenticationToken, locale, { personId }) {
  const url = `${baseUrl}/v004/media/actors/${personId}/portraitImage`;
  await del(authenticationToken, locale, url);
}

export async function deleteProfileImage (baseUrl, authenticationToken, locale, { personId }) {
  const url = `${baseUrl}/v004/media/actors/${personId}/profileCover`;
  await del(authenticationToken, locale, url);
}
