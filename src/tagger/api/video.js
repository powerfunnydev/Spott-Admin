import { get } from '../../api/request';

// TODO: Currently we take the first entry in localeData. Later on when localization
// is implemented, we can change this.

function _transformScenes (scenes) {
  const result = [];
  for (let i = 0; i < scenes.length; i++) {
    const { hidden, image: { uuid: imageId, url: imageUrl }, offsetInSeconds, similarScenes, status, uuid: id } = scenes[i];
    result.push({ hidden, id, imageId, imageUrl, offsetInSeconds, similarScenes: similarScenes.map(({ uuid }) => uuid), sceneNumber: i + 1, status });
  }
  return result;
}

/**
 * GET /video/videos/:videoId
 * Get video with all scenes by video id.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param (string) data.videoId
 * @returnExample
 *   {
 *     id: 'video-id',
 *     scenes: [{
 *       hidden: true,
 *       id: 'scene-id',
 *       imageUrl: 'http://spott-cms-uat.appiness.mobi/apptvate/rest/v004/image/images/539766be-4ee4-4fee-83a7-99775471eb7c',
 *       offsetInSeconds: 120,
 *       sceneNumber: 20,
 *       status: 'UNKNOWN or DONE or REVIEW or ATTENTION'
 *     }]
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getVideo (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { data: scenes } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}/scenes`);
  return {
    id: videoId,
    // Array comprehension, destructure every scene, transform it to a scene
    // which only holds relevant information for the UI.
    scenes: _transformScenes(scenes)
  };
}
