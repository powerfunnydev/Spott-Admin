import { get, post } from '../../api/request';

function _transformScene ({ hidden, image: { uuid: imageId, url: imageUrl }, offsetInSeconds, similarScenes, status, uuid: id }) {
  return { hidden, id, imageId, imageUrl, offsetInSeconds, similarScenes: similarScenes.map(({ uuid }) => uuid), status };
}

/**
 * POST /video/scenes/:sceneId
 * Partially update a scene.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} ids
 * @param {string} ids.sceneId
 * @param {string} ids.videoId
 * @param {Object} data
 * @param {boolean} [data.hidden] Is the scene hidden or not?
 * @param {boolean} [data.status] Is the scene already processed? What is the status? 'ATTENTION', 'DONE', 'REVIEW' or 'UNKNOWN'.
 * @return {object} The updated scene object.
 * @returnExample
 *   {
 *     hidden: true,
 *     id: 'scene-id',
 *     imageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v004/image/images/539766be-4ee4-4fee-83a7-99775471eb7c',
 *     status: 'DONE'
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postScene (baseUrl, authenticationToken, locale, { sceneId }, { hidden, status }) {
  const { body: scene } = await get(authenticationToken, locale, `${baseUrl}/v004/video/scenes/${sceneId}`);

  // Update the fields that are passed as argument.
  if (typeof scene.hidden === 'boolean') {
    scene.hidden = hidden;
  }
  if (typeof scene.status === 'string') {
    scene.status = status;
  }

  // Update the scene.
  const { body: updatedScene } = await post(authenticationToken, locale, `${baseUrl}/v004/video/scenes/${sceneId}`, scene);

  // Format updated scene.
  return _transformScene(updatedScene);
}

export async function getScenes (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { data: scenes } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/scenes`);
  return scenes.map((s, i) => {
    const scene = _transformScene(s);
    scene.sceneNumber = i + 1;
    return scene;
  });
}
