import { get } from './request';
import { transformVideo } from './transformers';

/**
 * GET /video/videos/:videoId
 * Get the details of a video, without scenes information.
 * @param {string} authenticationToken The authentication token of the logged in user.
 * @param {Object} data
 * @param (string) data.videoId
 * @returnExample
 *   {
 *     audioFingerprints: [
 *       {
 *         audioFilename: 'videos/10beb99b-e3e3-4715-a12a-7c021e2a0620/DEKEUKENV651_1F487725.aac'
 *         fingerprint: 'DC6FF55349760B44',
 *         language: 'nl',
 *         type: 'MUFIN',
 *       }
 *     ],
 *     description : 'De Keuken Van Sofie: seizoen 4 aflevering 51',
 *     id: 'video-id',
 *     scenes: [{
 *       hidden: true,
 *       id: 'scene-id',
 *       image: { id, url },
 *       offsetInSeconds: 120,
 *       status: 'UNKNOWN or DONE or REVIEW or ATTENTION'
 *     }],
 *     totalDurationInSeconds : 933,
 *     videoFilename: 'videos/10beb99b-e3e3-4715-a12a-7c021e2a0620/DEKEUKENV651_1F487725.mp4'
 *   }
 * @throws UnauthorizedError
 * @throws NotFoundError
 * @throws UnexpectedError
 */
export async function getVideo (baseUrl, authenticationToken, locale, { videoId }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v003/video/videos/${videoId}`);
  return transformVideo(body);
}
