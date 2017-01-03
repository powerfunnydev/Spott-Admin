import { get, post } from '../../api/request';

export async function postVideo (baseUrl, authenticationToken, locale, { keySceneId, videoId }) {
  const { body: video } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}`);
  video.keyScene = keySceneId && { uuid: keySceneId };
  await post(authenticationToken, locale, `${baseUrl}/v004/video/videos`, video);
}

/**
 * GET /video/videos/:videoId
 * Get video without scenes by video id.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param (string) data.videoId
 * @returnExample
 *   {
 *     id: 'video-id',
 *     keySceneId: 'key-scene-id'
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getVideo (baseUrl, authenticationToken, locale, { videoId }) {
  const { body: { keyScene } } = await get(authenticationToken, locale, `${baseUrl}/v004/video/videos/${videoId}`);
  return {
    id: videoId,
    keySceneId: keyScene && keyScene.uuid
  };
}
