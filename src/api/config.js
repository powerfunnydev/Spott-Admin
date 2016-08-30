import { get } from './request';

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
export async function getConfiguration () {
  const { body: config } = await get(null, null, `${window.location.origin}/config.json`);
  return config;
}
