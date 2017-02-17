import { del, get, post } from './request';
import { transformAudience } from './transformers';

export async function fetchAudience (baseUrl, authenticationToken, locale, { audienceId, mediumId }) {
  const url = `${baseUrl}/v004/media/media/${mediumId}/audiences/${audienceId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformAudience(body);
}

export async function fetchAudiences (baseUrl, authenticationToken, locale, { mediumId }) {
  const url = `${baseUrl}/v004/media/media/${mediumId}/audiences`;
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformAudience);
  return body;
}

export async function persistAudience (baseUrl, authenticationToken, locale, {
  countryIds, id, languageIds, mediumId, name
}) {
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/audiences`, {
    countries: countryIds && countryIds.map((uuid) => ({ uuid })),
    genders: [],
    languages: languageIds && languageIds.map((uuid) => ({ uuid })),
    name,
    uuid: id
  });
  return transformAudience(body);
}

export async function deleteAudience (baseUrl, authenticationToken, locale, { audienceId, mediumId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/audiences/${audienceId}`);
}
