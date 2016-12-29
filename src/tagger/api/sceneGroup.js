import { del, get, post } from '../../api/request';

function transformSceneGroup ({ firstScene, keyScene, label, uuid: id }) {
  // Scenes will be filled in the selector.
  return {
    firstSceneId: firstScene && firstScene.uuid,
    id,
    keySceneId: keyScene && keyScene.uuid,
    label,
    scenes: []
  };
}

export async function getSceneGroups (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/sceneGroups`);
  return data.map(transformSceneGroup);
}

export async function persistSceneGroup (baseUrl, authenticationToken, locale, { firstSceneId, id, keySceneId, label }) {
  let sceneGroup = {};
  if (id && id !== 'fake') {
    const res = await get(authenticationToken, locale, `${baseUrl}/v004/video/sceneGroups/${id}`);
    sceneGroup = res.body;
  }
  const newSceneGroup = await post(authenticationToken, locale, `${baseUrl}/v004/video/sceneGroups`, {
    ...sceneGroup,
    firstScene: firstSceneId && { uuid: firstSceneId },
    keyScene: keySceneId && { uuid: keySceneId },
    label
  });
  return transformSceneGroup(newSceneGroup);
}

export async function deleteSceneGroup (baseUrl, authenticationToken, locale, { sceneGroupId }) {
  await del(authenticationToken, locale, `${baseUrl}/v004/video/sceneGroups/${sceneGroupId}`);
}
