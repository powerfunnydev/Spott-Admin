import { del, get, post } from './request';
import { transformCharacter, transformListCharacter } from './transformers';

export async function searchCharacters (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25 }) {
  let url = `${baseUrl}/v004/media/characters?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformCharacter);
}

export async function searchMediumCharacters (baseUrl, authenticationToken, locale, { mediumId, searchString = '', page = 0, pageSize = 100 }) {
  let url = `${baseUrl}/v004/media/media/${mediumId}/castMembers?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformListCharacter);
}

export async function persistMediumCharacter (baseUrl, authenticationToken, locale, { mediumId, characterId }) {
  const { body } = await post(authenticationToken, locale, `${baseUrl}//v004/media/media/${mediumId}/castMembers/${characterId}`, {});
  return transformCharacter(body);
}

export async function deleteMediumCharacter (baseUrl, authenticationToken, locale, { mediumId, characterId }) {
  const { body } = await del(authenticationToken, locale, `${baseUrl}//v004/media/media/${mediumId}/castMembers/${characterId}`, {});
  return transformCharacter(body);
}
