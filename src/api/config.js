import * as request from './_request';
import { UnexpectedError } from './_errors';

/**
 * GET /config.json
 * Get the configuration, like the root url of the API.
 * @returnExample
 * {
 *   "urls": {
 *     "api": "https://spott-cms-rest-prd.appiness.mobi/rest",
 *     "apptvateWebsite": "http://apptvate.com",
 *     "cms": "http://spott-cms-prd.appiness.mobi",
 *     "cmsNext": "http://spott-cms-prd.appiness.mobi/cms-next",
 *     "tagger": "http://spott-cms-prd.appiness.mobi/tagger"
 *   },
 *   "environment": "Production"
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
