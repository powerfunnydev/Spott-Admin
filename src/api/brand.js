import { get } from './request';
import { transformListBrand } from './transformers';

export async function searchBrands (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 100 }) {
  let url = `${baseUrl}/v004/product/brands?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body: { data } } = await get(authenticationToken, locale, url);
  console.log('data', data);
  return data.map(transformListBrand);
}
