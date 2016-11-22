import { del, get, post } from './request';
import { transformEpisode } from './transformers';

export async function fetchEpisodes (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/media/serieEpisodes?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformEpisode);
  return body;
}

export async function fetchEpisode (baseUrl, authenticationToken, locale, { episodeId }) {
  const url = `${baseUrl}/v004/media/serieEpisodes/${episodeId}`;
  const { body } = await get(authenticationToken, locale, url);
  // console.log('before transform', { ...body });
  const result = transformEpisode(body);
  // console.log('after tranform', result);
  return result;
}

export async function persistEpisode (baseUrl, authenticationToken, locale, { episodeId, name }) {
  let cp = {};
  if (episodeId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/media/serieEpisodes/${episodeId}`);
    // console.log('body', body);
    cp = body;
  }
  const url = `${baseUrl}/v004/media/serieEpisodes`;
  await post(authenticationToken, locale, url, { ...cp, uuid: episodeId, name });
}

export async function deleteEpisode (baseUrl, authenticationToken, locale, { episodeId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/media/serieEpisodes/${episodeId}`);
}

export async function deleteEpisodes (baseUrl, authenticationToken, locale, { episodeIds }) {
  for (const episodeId of episodeIds) {
    await deleteEpisode(baseUrl, authenticationToken, locale, { episodeId });
  }
}
