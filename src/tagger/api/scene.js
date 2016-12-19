import { get, post } from '../../api/request';

function _transformScene ({ hidden, image: { id: imageId, url: imageUrl }, offsetInSeconds, similarScenes, status, uuid: id }) {
  return { hidden, id, imageId, imageUrl, offsetInSeconds, similarScenes: similarScenes.map(({ uuid }) => uuid), status };
}

/**
 * POST /video/videos/:videoId/scenes/:sceneId
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
 *     imageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v003/image/images/539766be-4ee4-4fee-83a7-99775471eb7c',
 *     status: 'DONE'
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function postScene (baseUrl, authenticationToken, locale, { sceneId, videoId }, { hidden, status }) {
  const { body: scene } = await get(authenticationToken, locale, `${baseUrl}/v003/video/videos/${videoId}/scenes/${sceneId}`);

  // Update the fields that are passed as argument.
  if (typeof scene.hidden === 'boolean') {
    scene.hidden = hidden;
  }
  if (typeof scene.status === 'string') {
    scene.status = status;
  }

  // Update the scene.
  const { body: updatedScene } = await post(authenticationToken, locale, `${baseUrl}/v003/video/videos/${videoId}/scenes/${sceneId}`, scene);

  // Format updated scene.
  return _transformScene(updatedScene);
}

/**
 * GET /video/videos/:videoId/scenes/:sceneId
 * Get the details of the scene, including the similar frames.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} ids
 * @param {string} ids.sceneId
 * @param {string} ids.videoId
 * @return {object} The scene details.
 * @returnExample
 *   {
 *     hidden: true,
 *     id: 'scene-id',
 *     imageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v003/image/images/539766be-4ee4-4fee-83a7-99775471eb7c',
 *     status: 'DONE'
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getScene (baseUrl, authenticationToken, locale, { sceneId, videoId }) {
  const { body: scene } = await get(authenticationToken, locale, `${baseUrl}/v003/video/videos/${videoId}/scenes/${sceneId}`);
  // Format updated scene.
  return _transformScene(scene);
}
