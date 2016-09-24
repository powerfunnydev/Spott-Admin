import { get } from './request';
import { transformBrandSubscription, transformCharacterSubscription, transformProductView, transformMediumSubscription } from './transformers';

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
  const { body: ageRanges } = await get(authenticationToken, locale, `${baseUrl}/v003/report/ageRanges`);
  return ageRanges.map(({ from, to }) => {
    const description = to ? `${from}-${to}` : `${from}+`;
    return { description, id: description };
  });
}

export async function getGenders (baseUrl, authenticationToken, locale) {
  const { body: genders } = await get(authenticationToken, locale, `${baseUrl}/v003/system/genders`);
  return genders.map(({ description, gender }) => ({ description, id: gender }));
}

export async function getTimelineData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumId, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?dataFormat=DATE_BASED&type=${eventType}&mediumUuid=${mediumId}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.format())}&aggregationLevel=DAY&fillGaps=true`);
  return data;
}

export async function getAgeData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumId, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?dataFormat=AGE_BASED&type=${eventType}&mediumUuid=${mediumId}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.format())}&aggregationLevel=DAY&fillGaps=true`);
  return data.map(({ ageRange: { from, to }, value }) => ({ label: to ? `${from}-${to}` : `${from}+`, value }));
}

export async function getGenderData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumId, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?dataFormat=GENDER_BASED&type=${eventType}&mediumUuid=${mediumId}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.format())}&aggregationLevel=DAY&fillGaps=true`);
  return data.map(({ gender, value }) => ({ id: gender, value }));
}

export async function getRankingCharacterSubscriptions (baseUrl, authenticationToken, locale, { mediumIds }) {
  const { body: { characterSubscriptions } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?type=CHARACTER_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}`);
  return characterSubscriptions.map(transformCharacterSubscription);
}

export async function getRankingBrandSubscriptions (baseUrl, authenticationToken, locale, { mediumIds }) {
  const { body: { brandSubscriptions } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?type=BRAND_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}`);
  return brandSubscriptions.map(transformBrandSubscription);
}

export async function getRankingMediumSubscriptions (baseUrl, authenticationToken, locale, { mediumIds }) {
  const { body: { mediumSubscriptions } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?type=MEDIUM_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}`);
  return mediumSubscriptions.map(transformMediumSubscription);
}

export async function getRankingProductViews (baseUrl, authenticationToken, locale, { mediumIds }) {
  const { body: { productViews } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?type=PRODUCT_VIEWS&mediaUuidList=${mediumIds.join(',')}`);
  return productViews.map(transformProductView);
}
