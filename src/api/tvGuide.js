import { del, get, post } from './request';
import { transformTvGuideEntry, transformSingleTvGuideEntry } from './transformers';

export async function fetchTvGuideEntries (baseUrl, authenticationToken, locale, { page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/tvGuideEntries?page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformTvGuideEntry);
  return body;
}

export async function fetchTvGuideEntry (baseUrl, authenticationToken, locale, { tvGuideEntryId }) {
  const url = `${baseUrl}/v004/media/tvGuideEntries/${tvGuideEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformSingleTvGuideEntry(body);
}

export async function persistTvGuideEntry (baseUrl, authenticationToken, locale, { id, mediumId, episodeId, broadcastChannelId, startDate, startTime, endDate, endTime }) {
  // Use the time and use it in the date.
  const start = startDate.hours(startTime.hours()).minutes(startTime.minutes());
  const end = endDate.hours(endTime.hours()).minutes(endTime.minutes());
  const result = await post(authenticationToken, locale, `${baseUrl}/v004/media/tvGuideEntries`, {
    uuid: id,
    channel: { uuid: broadcastChannelId },
    end: end.format(),
    start: start.format(),
    medium: { uuid: episodeId || mediumId }
  });
  return transformSingleTvGuideEntry(result.body);
}

export async function deleteTvGuideEntry (baseUrl, authenticationToken, locale, { tvGuideEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/tvGuideEntries/${tvGuideEntryId}`);
}

export async function deleteTvGuideEntries (baseUrl, authenticationToken, locale, { tvGuideEntryIds }) {
  for (const tvGuideEntryId of tvGuideEntryIds) {
    await del(authenticationToken, locale, `${baseUrl}/v004/media/tvGuideEntries/${tvGuideEntryId}`);
  }
}
