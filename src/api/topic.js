import { del, get, post, postFormData } from './request';
import { transformListTopic, transformTopic } from './transformers';

export async function deleteBackgroundImage (baseUrl, authenticationToken, locale, { topicId }) {
  const url = `${baseUrl}/v004/data/topics/${topicId}/profileCover`;
  await del(authenticationToken, locale, url);
}

export async function deleteThumbImage (baseUrl, authenticationToken, locale, { topicId }) {
  const url = `${baseUrl}/v004/data/topics/${topicId}/icon`;
  await del(authenticationToken, locale, url);
}

export async function deleteTopic (baseUrl, authenticationToken, locale, { topicId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/data/topics/${topicId}`);
}

export async function deleteTopics (baseUrl, authenticationToken, locale, { topicIds }) {
  for (const topicId of topicIds) {
    await deleteTopic(baseUrl, authenticationToken, locale, { topicId });
  }
}

export async function fetchCropTopics (baseUrl, authenticationToken, locale, { region: { height, width, x, y }, sceneId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/video/scenes/${sceneId}/topics?height=${Math.round(height)}&width=${Math.round(width)}&x=${Math.round(x)}&y=${Math.round(y)}`);
  body.data = body.data.map(transformTopic);
  return body;
}

export async function fetchTopic (baseUrl, authenticationToken, locale, { topicId }) {
  const url = `${baseUrl}/v004/data/topics/${topicId}`;
  const { body } = await get(authenticationToken, locale, url);
  const result = transformTopic(body);
  return result;
}

export async function fetchTopics (baseUrl, authenticationToken, locale, { searchString = '', page = 0, pageSize = 25, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/data/topics?page=${page}&pageSize=${pageSize}`;
  if (searchString) {
    url = url.concat(`&searchString=${encodeURIComponent(searchString)}`);
  }
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformListTopic);
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

export async function searchTopics (baseUrl, authenticationToken, locale, { searchString }) {
  let url = `${baseUrl}/v004/data/topics?page=0&pageSize=25`;
  if (searchString) {
    url = url.concat(`&searchString=${searchString}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformTopic);
  return body;
}

export async function uploadBackgroundImage (baseUrl, authenticationToken, locale, { topicId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/data/topics/${topicId}/profileCover`, formData, callback);
  return transformTopic(result.body);
}

export async function uploadThumbImage (baseUrl, authenticationToken, locale, { topicId, image, callback }) {
  const formData = new FormData();
  formData.append('file', image);
  const result = await postFormData(authenticationToken, locale, `${baseUrl}/v004/data/topics/${topicId}/icon`, formData, callback);
  return transformTopic(result.body);
}
