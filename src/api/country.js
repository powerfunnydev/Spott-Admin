import { get } from './request';
import { transformCountry } from './transformers';

export async function fetchCountries (baseUrl, authenticationToken, locale, { searchString }) {
  let url = `${baseUrl}/v004/system/countries?page=0&pageSize=25`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformCountry);
  return body;
}
