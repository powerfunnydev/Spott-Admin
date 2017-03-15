import { get } from './request';
import { transformTopMedia, transformTopPeople } from './transformers';

// TODO: implement this function
export async function fetchTopMedia (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/media?types=TV_SERIE,MOVIE`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopMedia);
  return body;
}

// TODO: implement this function
export async function fetchTopPeople (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchDemographics (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchGenderData (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchAgeData (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}
