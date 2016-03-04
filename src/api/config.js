import * as request from './_request';
import { UnexpectedError } from './_errors';

/**
 * GET /config.json
 * Get the configuration, like the root url of the API.
 * @returnExample
 * {
 *   api: {
 *     root: 'https://spott-cms-rest-tst.appiness.mobi/rest/v001/'
 *   }
 * }
 * @throws UnexpectedError
 */
export async function getConfig () {
  try {
    const { body: config } = await request.get(null, `${window.location.origin}/config.json`);
    return config;
  } catch (error) {
    console.log(error);
    throw new UnexpectedError(error);
  }
}
