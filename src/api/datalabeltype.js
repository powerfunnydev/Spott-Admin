import { del, get, post } from './request';
import { transformDatalabeltype, transformNewDatalabeltype } from './transformers';

export async function fetchDatalabeltypes (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/data/labelTypes?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformDatalabeltype);
  return body;
}

export async function fetchAllDatalabeltypes (baseUrl, authenticationToken, locale) {
  const url = `${baseUrl}/v004/data/labelTypes?`;

  const { body } = await get(authenticationToken, locale, url);
  // There is also usable data in body (not only in data field).
  // We need also fields page, pageCount,...
  body.data = body.data.map(transformDatalabeltype);
  return body;
}

export async function fetchDatalabeltype (baseUrl, authenticationToken, locale, { datalabeltypeId }) {
  const url = `${baseUrl}/v004/data/labelTypes/${datalabeltypeId}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformNewDatalabeltype(body, locale);
}

export async function persistDatalabeltype (baseUrl, authenticationToken, locale, { id, name, basedOnDefaultLocale, defaultLocale, locales }) {
  let datalabeltype = {};
  if (id) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/data/labelTypes/${id}`);
    datalabeltype = body;
  }

  datalabeltype.defaultLocale = defaultLocale;
  datalabeltype.localeData = datalabeltype.localeData || []; // Ensure we have locale data

  locales.forEach((locale) => {
    let localeData = datalabeltype.localeData.find((ld) => ld.locale === locale);
    if (!localeData) {
      localeData = { locale };
      datalabeltype.localeData.push(localeData);
    }
    localeData.name = name && name[locale];
    localeData.basedOnDefaultLocale = basedOnDefaultLocale && basedOnDefaultLocale[locale];
  });

  const url = `${baseUrl}/v004/data/labelTypes`;
  const result = await post(authenticationToken, locale, url, datalabeltype);
  return transformNewDatalabeltype(result.body, locale);
}

export async function deleteDatalabeltype (baseUrl, authenticationToken, locale, { datalabeltypeId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/data/labelTypes/${datalabeltypeId}`);
}

export async function deleteDatalabeltypes (baseUrl, authenticationToken, locale, { datalabeltypeIds }) {
  for (const datalabeltypeId of datalabeltypeIds) {
    await deleteDatalabeltype(baseUrl, authenticationToken, locale, { datalabeltypeId });
  }
}
