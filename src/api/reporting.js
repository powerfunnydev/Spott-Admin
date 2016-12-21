import { get } from './request';
import {
  transformPaging, transformActivityData, transformBrandSubscription,
  transformCharacterSubscription, transformProductView, transformMediumInfo,
  transformProductBuy, transformProductImpression
} from './transformers';

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
  const { body: events } = await get(authenticationToken, locale, `${baseUrl}/v004/report/mediumActivityReportEventTypes`);
  return events.map(({ description, type }) => ({ description, id: type }));
}

export async function getAges (baseUrl, authenticationToken, locale) {
  const { body: ageRanges } = await get(authenticationToken, locale, `${baseUrl}/v004/report/ageRanges`);
  return ageRanges.map(({ from, to }) => {
    return {
      description: to ? `${from}-${to}` : `${from}+`,
      id: to ? `${from}-${to}` : `${from}-`
    };
  });
}

export async function getGenders (baseUrl, authenticationToken, locale) {
  const { body: genders } = await get(authenticationToken, locale, `${baseUrl}/v004/system/genders`);
  return genders.map(({ description, gender }) => ({ description, id: gender }));
}

// { mediumId: [{ timestamp, value }] }
export async function _getTimelineData (baseUrl, authenticationToken, locale, { endDate, eventId, mediumIds, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumActivity?dataFormat=DATE_BASED&type=${eventId}&mediumUuid=${mediumIds.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&aggregationLevel=DAY&fillGaps=true`);
  return transformActivityData(data, (d) => {
    // Last entry is the always 0, skip it.
    // We want exclusive the end date, so the end date dot is not shown on charts.
    d.splice(-1, 1);
    return d;
  });
}

function mergeValues (result, newData) {
  if (!result) {
    return newData;
  }
  // Aggregate the data for each medium.
  for (const mediumId in newData) {
    const newValues = newData[mediumId];
    const resValues = result[mediumId];
    for (let i = 0; i < newValues.length; i++) {
      // Make sum of previous with the new value.
      resValues[i].value += newValues[i].value;
    }
  }
  return result;
}

// Aggregates the data for all events.
export async function getTimelineData (baseUrl, authenticationToken, locale, { endDate, eventIds, mediumIds, startDate }) {
  let result;
  // For each event we retrieve the data for the given media.
  for (const eventId of eventIds) {
    // For each medium we have an array of tuples ({ timestamp, value }).
    // { mediumId: [{ timestamp, value }] }
    const newData = await _getTimelineData(baseUrl, authenticationToken, locale, { endDate, eventId, mediumIds, startDate });
    result = mergeValues(result, newData);
  }
  return result;
}

export async function _getAgeData (baseUrl, authenticationToken, locale, { endDate, eventId, mediumIds, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumActivity?dataFormat=AGE_BASED&type=${eventId}&mediumUuid=${mediumIds.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&aggregationLevel=DAY&fillGaps=true`);
  // There is no need for an id for ages.
  return transformActivityData(data, (d) => d.map(({ ageRange: { from, to }, value }) => ({ label: to ? `${from}-${to}` : `${from}+`, value })));
}

// Aggregates the data for all events.
export async function getAgeData (baseUrl, authenticationToken, locale, { endDate, eventIds, mediumIds, startDate }) {
  let result;
  // For each event we retrieve the data for the given media.
  for (const eventId of eventIds) {
    const newData = await _getAgeData(baseUrl, authenticationToken, locale, { endDate, eventId, mediumIds, startDate });
    result = mergeValues(result, newData);
  }
  return result;
}

export async function _getGenderData (baseUrl, authenticationToken, locale, { endDate, eventId, mediumIds, startDate }) {
  const { body: { data } } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumActivity?dataFormat=GENDER_BASED&type=${eventId}&mediumUuid=${mediumIds.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&aggregationLevel=DAY&fillGaps=true`);
  return transformActivityData(data, (d) => d.map(({ gender, value }) => ({ id: gender, value })));
}

export async function getGenderData (baseUrl, authenticationToken, locale, { endDate, eventIds, mediumIds, startDate }) {
  let result;
  // For each event we retrieve the data for the given media.
  for (const eventId of eventIds) {
    const newData = await _getGenderData(baseUrl, authenticationToken, locale, { endDate, eventId, mediumIds, startDate });
    result = mergeValues(result, newData);
  }
  return result;
}

export async function getRankingCharacterSubscriptions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=CHARACTER_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.characterSubscriptions.map(transformCharacterSubscription);
  return result;
}

export async function getRankingBrandSubscriptions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=BRAND_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.brandSubscriptions.map(transformBrandSubscription);
  return result;
}

export async function getRankingMediumSubscriptions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=MEDIUM_SUBSCRIPTIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.mediumSubscriptions.map(transformMediumInfo);
  return result;
}

export async function getRankingMediumSyncs (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=MEDIUM_SYNCS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.mediumSyncs.map(transformMediumInfo);
  return result;
}

export async function getRankingProductViews (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=PRODUCT_VIEWS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.productViews.map(transformProductView);
  return result;
}

export async function getRankingProductImpressions (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=PRODUCT_IMPRESSIONS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.productImpressions.map(transformProductImpression);
  return result;
}

export async function getRankingProductBuys (baseUrl, authenticationToken, locale, { ages, genders, mediumIds, page = 0 }) {
  const { body } = await get(authenticationToken, locale, `${baseUrl}/v004/report/reports/mediumRanking?ageRanges=${ages.join(',')}&genders=${genders.join(',')}&type=PRODUCT_BUYS&mediaUuidList=${mediumIds.join(',')}&page=${page}&pageSize=20`);
  const result = transformPaging(body);
  result.data = body.productViews.map(transformProductBuy);
  return result;
}
