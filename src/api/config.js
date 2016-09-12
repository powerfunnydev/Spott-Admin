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
  const { body: { environment, urls } } = await get(null, null, '/config.json');
  const { body: version } = await get(null, null, '/version.json');
  const { body: { version: apiVersion } } = await get(null, null, `${urls.api}/v003/system/info`);

  return {
    environment,
    urls,
    version: {
      apiVersion: apiVersion.version,
      apiVersionFull: `${apiVersion.version} build ${apiVersion.build} (${apiVersion.buildTime})`,
      version: version.version,
      versionFull: `${version.version} build ${version.build} (${version.timestamp})`
    }
  };
}
