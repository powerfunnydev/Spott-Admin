import { del, get, post } from './request';
import { transformScheduleEntry } from './transformers';

export async function fetchScheduleEntry (baseUrl, authenticationToken, locale, { scheduleEntryId }) {
  const url = `${baseUrl}/v004/media/commercialScheduleEntries/${scheduleEntryId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformScheduleEntry(body);
}

export async function persistScheduleEntry (baseUrl, authenticationToken, locale, {
  broadcasterId, broadcastChannelIds, commercialId, end, id, start, mediumIds
}) {
  const { body } = await post(authenticationToken, locale, `${baseUrl}/v004/media/commercialScheduleEntries`, {
    broadcaster: broadcasterId && { uuid: broadcasterId } || undefined,
    channels: broadcastChannelIds && broadcastChannelIds.map((uuid) => ({ uuid })),
    commercial: commercialId && { uuid: commercialId },
    end,
    media: mediumIds && mediumIds.map((uuid) => ({ uuid })),
    start,
    uuid: id
  });
  return transformScheduleEntry(body);
}

export async function deleteScheduleEntry (baseUrl, authenticationToken, locale, { scheduleEntryId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/commercialScheduleEntries/${scheduleEntryId}`);
}
