import { get } from './request';

/**
 * GET /report/activityReportEventTypes
 * Get the event types.
 * @returnExample
 * [{
 *   "description": "string",
 *   "id": "CHARACTER_SUBSCRIPTIONS"
 * }]
 * @throws UnexpectedError
 */
export async function getActivityReportEvents (baseUrl, authenticationToken, locale) {
  const { body: events } = await get(authenticationToken, locale, `${baseUrl}/v003/report/mediumActivityReportEventTypes`);
  return events.map(({ description, type }) => ({ description, id: type }));
}

export async function getAges (baseUrl, authenticationToken, locale) {
  const { body: ages } = await get(authenticationToken, locale, `${baseUrl}/v003/report/mediumActivityReportEventTypes`);
  return [ '-18', '18-25', '26-35', '36-45', '46-65', '65+' ].map((age) => ({ description: age, id: age }));
}

export async function getGenders (baseUrl, authenticationToken, locale) {
  const { body: genders } = await get(authenticationToken, locale, `${baseUrl}/v003/report/mediumActivityReportEventTypes`);
  return [ 'Male', 'Female' ].map((gender) => ({ description: gender, id: gender.toUpperCase() }));
}

export async function getTimelineData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumId, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?type=${eventType}&mediumUuid=${mediumId}&startDate=${ encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.format())}&aggregationLevel=DAY&fillGaps=true`);
  return data;
}

export async function getAgeData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumId, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?type=${eventType}&mediumUuid=${mediumId}&startDate=${ encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.format())}&aggregationLevel=DAY&fillGaps=true`);
  const ages = [ '-18', '18-25', '26-35', '36-45', '46-65', '65+' ];
  return data.slice(0, 6).map(({ timeline, value }, i) => ({ label: ages[i], value: value * 4 }));
}

export async function getGenderData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumId, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?type=${eventType}&mediumUuid=${mediumId}&startDate=${ encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.format())}&aggregationLevel=DAY&fillGaps=true`);
  return data;
}

export async function getRankingCharacterSubscriptions (baseUrl, authenticationToken, locale) {
  const { body: { characterSubscriptions } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?type=CHARACTER_SUBSCRIPTIONS`);
  return characterSubscriptions;
}
