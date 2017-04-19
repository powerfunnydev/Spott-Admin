import { get, post } from './request';
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

export async function persistTopic (baseUrl, authenticationToken, locale, { text, topicId }) {
  let topic = {};
  if (topicId) {
    const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/data/topics/${topicId}`);
    topic = body;
  }

  topic.text = text;

  const url = `${baseUrl}/v004/data/topics`;
  const { body } = await post(authenticationToken, locale, url, topic);
  return transformTopic(body);
}

export async function fetchCropTopics (baseUrl, authenticationToken, locale, { region: { height, width, x, y }, sceneId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/scenes/${sceneId}/topics?height=${Math.round(height)}&width=${Math.round(width)}&x=${x}&y=${y}`);
  body.data = body.data.map(transformTopic);
  return body;
}
