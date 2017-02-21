import { del, get, post } from './request';
import { transformAvailability } from './transformers';

export async function fetchAvailabilities (baseUrl, authenticationToken, locale, { mediumId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/availabilities`);
  return data.map(transformAvailability);
}

export async function persistAvailability (baseUrl, authenticationToken, locale, { availabilityFrom, availabilityTo, countryId, id, mediumId, videoStatus }) {
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/availabilities`, {
    country: countryId ? { uuid: countryId } : null,
    endTimeStamp: availabilityTo,
    startTimeStamp: availabilityFrom,
    uuid: id,
    videoStatus
  });
  return transformAvailability(body);
}

export async function deleteAvailability (baseUrl, authenticationToken, locale, { availabilityId, mediumId }) {
  const { body } = await del(authenticationToken, locale, `${baseUrl}/v004/media/media/${mediumId}/availabilities/${availabilityId}`, {});
  return transformAvailability(body);
}
