import { get } from './request';
import { transformTopMedia } from './transformers';

export async function fetchTopMedia (baseUrl, authenticationToken, locale) {
  // const { body: events } = await get(authenticationToken, locale, `${baseUrl}/v004/report/mediumActivityReportEventTypes`);
  // return events.map(({ description, type }) => ({ description, id: type }));
  const searchUrl = `${baseUrl}/v004/media/media?pageSize=1000&types=TV_SERIE,MOVIE`;
  const { body: { data } } = await get(authenticationToken, locale, searchUrl);
  return data.map(transformTopMedia);
}
