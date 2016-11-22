import { get } from './request';
import { ADMIN, CONTENT_MANAGER } from '../constants/userRoles';

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

/**
 * GET /system/configuration
 */
export async function getAuthorizedConfiguration (baseUrl, authenticationToken, locale, roles) {
  const { body: { supportedLanguages } } = await get(authenticationToken, locale, `${baseUrl}/v003/system/configuration`);
  const { body: countries } = await get(authenticationToken, locale, `${baseUrl}/v003/system/countries`);
  const { body: currencies } = await get(authenticationToken, locale, `${baseUrl}/v003/system/currencies`);
  const { body: feedEntryTypes } = (roles.includes(ADMIN) || roles.includes(CONTENT_MANAGER)) && await get(authenticationToken, locale, `${baseUrl}/v003/feed/entryTypes`);
  const { body: { data: applications } } = await get(authenticationToken, locale, `${baseUrl}/v003/system/mobileApplications?pageSize=1000`);
  const { body: { value: pushWindowSizeInMinutes } } = roles.includes(ADMIN) && await get(authenticationToken, locale, `${baseUrl}/v003/system/properties/push.default.window.in.minutes.`) || { body: { value: undefined } };
  const { body: actionTypes } = (roles.includes(ADMIN) || roles.includes(CONTENT_MANAGER)) && await get(authenticationToken, locale, `${baseUrl}/v003/push/actionTypes`) || { body: undefined };
  const genders = await get(authenticationToken, locale, `${baseUrl}/v003/system/genders`);
  return {
    actionTypes,
    applications: applications.map(({ name, uuid, platforms }) => ({ id: uuid, name, deviceTypes: platforms.map(({ type }) => type) })),
    countries: countries.reduce((obj, current) => {
        // Note the iso2Code acts as uuid for the backend.
      obj[current.iso2Code] = { id: current.iso2Code, name: current.name };
      return obj;
    }, {}),
    currencies: currencies.reduce((obj, current) => {
        // Note the code acts as uuid for the backend.
      obj[current.code] = { description: current.description, id: current.code, symbol: current.symbol };
      return obj;
    }, {}),
    defaultPushWindowSizeInMinutes: pushWindowSizeInMinutes && parseInt(pushWindowSizeInMinutes, 10),
    feedEntryTypes: feedEntryTypes && feedEntryTypes.reduce((obj, current) => {
        // Note thet the type acts as 'uuid' for the backend.
      obj[current.type] = current;
      return obj;
    }, {}),
    locales: supportedLanguages.map((current) => current.locale),
    localeNames: supportedLanguages.reduce((obj, current) => {
      obj[current.locale] = current.name;
      return obj;
    }, {}),
    genders: genders.body.reduce((obj, current) => {
      obj[current.gender] = current.description;
      return obj;
    }, {})
  };
}
