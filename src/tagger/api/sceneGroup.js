import { del, get, post } from '../../api/request';

function transformSceneGroup ({ firstScene, label, uuid: id }) {
  // Scenes will be filled in the selector.
  return { firstSceneId: firstScene && firstScene.uuid, id, label, scenes: [] };
}

export async function getSceneGroups (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/sceneGroups`);
  return data.map(transformSceneGroup);
}

export async function persistSceneGroup (baseUrl, authenticationToken, locale, { firstSceneId, id, label }) {
  let sceneGroup = {};
  if (id && id !== 'fake') {
    const res = await get(authenticationToken, locale, `${baseUrl}/v004/video/sceneGroups/${id}`);
    sceneGroup = res.body;
  }
  await post(authenticationToken, locale, `${baseUrl}/v004/video/sceneGroups`, { ...sceneGroup, firstScene: { uuid: firstSceneId }, label });
}

export async function deleteSceneGroup (baseUrl, authenticationToken, locale, { sceneGroupId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/video/sceneGroups/${sceneGroupId}`);
}
