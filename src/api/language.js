import { get } from './request';
import { transformLanguage } from './transformers';

export async function fetchLanguages (baseUrl, authenticationToken, locale) {
  const url = `${baseUrl}/v004/system/languages?page=0&pageSize=25`;
  // if (searchString) {
  //   url = url.concat(`&searchString=${searchString}`);
  // }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformLanguage);
  return body;
}
