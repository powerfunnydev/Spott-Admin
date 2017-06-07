import { del, get, post } from './request';
import { transformDatalabel, transformSingleDatalabel } from './transformers';

export async function fetchDatalabels (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField, typeUuid }) {
  let url = `${baseUrl}/v004/data/labels?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  if (typeUuid) {
    url = url.concat(`&typeUuid=${typeUuid}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformDatalabel);
  return body;
}

export async function fetchDatalabel (baseUrl, authenticationToken, locale, { datalabelId }) {
  const url = `${baseUrl}/v004/data/labels/${datalabelId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformSingleDatalabel(body, locale);
}

export async function persistDatalabel (baseUrl, authenticationToken, locale, { id, name, type }) {
  let datalabel;
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/data/labels/${id}`);
    datalabel = body;
  }
  const url = `${baseUrl}/v004/data/labels`;
  const result = await post(authenticationToken, locale, url, { ...datalabel, defaultLocale: locale, uuid: id, localeData: [ { locale, name } ], type: { uuid: type.id } });
  return transformSingleDatalabel(result.body, locale);
}

export async function deleteDatalabel (baseUrl, authenticationToken, locale, { datalabelId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/data/labels/${datalabelId}`);
}

export async function deleteDatalabels (baseUrl, authenticationToken, locale, { datalabelIds }) {
  for (const datalabelId of datalabelIds) {
    await deleteDatalabel(baseUrl, authenticationToken, locale, { datalabelId });
  }
}
