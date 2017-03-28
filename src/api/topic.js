import { get } from './request';
import { transformTopic } from './transformers';

export async function searchTopics (baseUrl, authenticationToken, locale, { searchString }) {
  let url = `${baseUrl}/v004/data/topics?page=0&pageSize=25`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformTopic);
  return body;
}
