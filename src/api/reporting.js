import { get } from './request';
import { transformPaging, transformActivityData, transformBrandSubscription, transformCharacterSubscription, transformProductView, transformMediumInfo } from './transformers';

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
    return {
      description: to ? `${from}-${to}` : `${from}+`,
      id: to ? `${from}-${to}` : `${from}-`
    };
  });
}

export async function getGenders (baseUrl, authenticationToken, locale) {
  const { body: genders } = await get(authenticationToken, locale, `${baseUrl}/v003/system/genders`);
  return genders.map(({ description, gender }) => ({ description, id: gender }));
}

export async function getTimelineData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumIds, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?dataFormat=DATE_BASED&type=${eventType}&mediumUuid=${mediumIds.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&aggregationLevel=DAY&fillGaps=true`);
  return transformActivityData(data, (d) => d);
}

export async function getAgeData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumIds, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?dataFormat=AGE_BASED&type=${eventType}&mediumUuid=${mediumIds.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&aggregationLevel=DAY&fillGaps=true`);
  // There is no need for an id for ages.
  return transformActivityData(data, (d) => d.map(({ ageRange: { from, to }, value }) => ({ label: to ? `${from}-${to}` : `${from}+`, value })));
}

export async function getGenderData (baseUrl, authenticationToken, locale, { endDate, eventType, mediumIds, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumActivity?dataFormat=GENDER_BASED&type=${eventType}&mediumUuid=${mediumIds.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&aggregationLevel=DAY&fillGaps=true`);
  return transformActivityData(data, (d) => d.map(({ gender, value }) => ({ id: gender, value })));
}

export async function getRankingCharacterSubscriptions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=CHARACTER_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.characterSubscriptions.map(transformCharacterSubscription);
  return result;
}

export async function getRankingBrandSubscriptions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=BRAND_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.brandSubscriptions.map(transformBrandSubscription);
  return result;
}

export async function getRankingMediumSubscriptions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=MEDIUM_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.mediumSubscriptions.map(transformMediumInfo);
  return result;
}

export async function getRankingMediumSyncs (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=MEDIUM_SYNCS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.mediumSyncs.map(transformMediumInfo);
  return result;
}

export async function getRankingProductViews (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v003/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=PRODUCT_VIEWS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.productViews.map(transformProductView);
  return result;
}
