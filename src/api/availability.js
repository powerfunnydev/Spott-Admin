import { del, get, post } from './request';
import { transformAvailability } from './transformers';

export async function fetchAvailability (baseUrl, authenticationToken, locale, { availabilityId, mediumId, mediumType }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/availabilities/${availabilityId}`
    : `${baseUrl}/v004/media/media/${mediumId}/availabilities/${availabilityId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformAvailability(body);
}

export async function fetchAvailabilities (baseUrl, authenticationToken, locale, { mediumId, mediumType }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/availabilities`
    : `${baseUrl}/v004/media/media/${mediumId}/availabilities`;
  const { body: { data } } = await get(authenticationToken, locale, url);
  return data.map(transformAvailability);
}

export async function persistAvailability (baseUrl, authenticationToken, locale, { availabilityFrom, availabilityTo, countryId, id, mediumId, mediumType, videoStatus }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/availabilities`
    : `${baseUrl}/v004/media/media/${mediumId}/availabilities`;
  const { body } = await post(authenticationToken, locale, url, {
    country: countryId ? { uuid: countryId } : null,
    endTimeStamp: availabilityTo,
    startTimeStamp: availabilityFrom,
    uuid: id,
    videoStatus
  });
  return transformAvailability(body);
}

export async function deleteAvailability (baseUrl, authenticationToken, locale, { availabilityId, mediumId, mediumType }) {
  const url = mediumType === 'spott'
    ? `${baseUrl}/v004/post/posts/${mediumId}/availabilities/${availabilityId}`
    : `${baseUrl}/v004/media/media/${mediumId}/availabilities/${availabilityId}`;
  const { body } = await del(authenticationToken, locale, url, {});
  return transformAvailability(body);
}
