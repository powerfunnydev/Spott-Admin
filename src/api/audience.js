import { del, get, post } from './request';
import { transformAudience } from './transformers';

export async function fetchAudience (baseUrl, authenticationToken, locale, { audienceId, mediumId, mediumType }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/audiences/${audienceId}`
    : `${baseUrl}/v004/media/media/${mediumId}/audiences/${audienceId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformAudience(body);
}

export async function fetchAudiences (baseUrl, authenticationToken, locale, { mediumId, mediumType }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/audiences`
    : `${baseUrl}/v004/media/media/${mediumId}/audiences`;
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformAudience);
  return body;
}

export async function persistAudience (baseUrl, authenticationToken, locale, {
  countryIds, id, languageIds, mediumId, mediumType, name
}) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/audiences`
    : `${baseUrl}/v004/media/media/${mediumId}/audiences`;
  const { body } = await post(authenticationToken, locale, url, {
    countries: countryIds && countryIds.map((uuid) => ({ uuid })),
    genders: [],
    languages: languageIds && languageIds.map((uuid) => ({ uuid })),
    name,
    uuid: id
  });
  return transformAudience(body);
}

export async function deleteAudience (baseUrl, authenticationToken, locale, { audienceId, mediumId, mediumType }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/audiences/${audienceId}`
    : `${baseUrl}/v004/media/media/${mediumId}/audiences/${audienceId}`;
  await del(authenticationToken, locale, url);
}
