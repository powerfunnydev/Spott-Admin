import { get } from './request';
import { transformTopMedia, transformTopPeople } from './transformers';
import { BRAND_SUBSCRIPTIONS, CONVERSION, PRODUCT_BUYS, PRODUCT_IMPRESSIONS, PRODUCT_VIEWS, TAGGED_PRODUCTS } from '../constants/metricTypes';

const chartColors = [
  '#058dc7',
  '#50b432',
  '#ed561b',
  '#dddf00',
  '#24cbe5',
  '#64e572',
  '#ff9655',
  '#fff263',
  '#6af9c4',
  '#f45b5b',
  '#8085e9',
  '#2b908f',
  '#f7a35c'
];

export async function fetchBrandDashboardEvents (baseUrl, authenticationToken, locale) {
  const { body: events } = await get(authenticationToken, locale, `${baseUrl}/v004/report/brandActivityReportEventTypes`);
  return events.map(({ description, type }, i) => ({ color: chartColors[i % chartColors.length], description, id: type }));
}

// TODO: implement this function
export async function fetchTopMedia (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/media?types=TV_SERIE,MOVIE`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopMedia);
  return body;
}

// TODO: implement this function
export async function fetchTopPeople (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchDemographics (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchGenderData (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchAgeData (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchDateData (baseUrl, authenticationToken, locale, { ages, brandId, eventIds, endDate, genders, startDate }) {
  const eventData = {};
  for (const eventId of eventIds) {
    const url = `${baseUrl}/v004/report/reports/brands/dateGraph?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventId}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
    const { body } = await get(authenticationToken, locale, url);
    eventData[eventId] = body.data;
  }

  const url = `${baseUrl}/v004/report/reports/brands/userGraph?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventIds.join(',')}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  const { body: { data: userData } } = await get(authenticationToken, locale, url);

  return {
    eventData,
    userData
  };
}

const metrics = {
  [BRAND_SUBSCRIPTIONS]: 'brandSubscriptions',
  [CONVERSION]: 'conversion',
  [PRODUCT_BUYS]: 'productBuys',
  [PRODUCT_IMPRESSIONS]: 'productImpressions',
  [PRODUCT_VIEWS]: 'productViews',
  [TAGGED_PRODUCTS]: 'taggedProducts'
};

export async function fetchKeyMetrics (baseUrl, authenticationToken, locale, { ages, brandId, endDate, genders, startDate }) {
  const result = {};
  for (const type in metrics) {
    const url = `${baseUrl}/v004/report/reports/brands/metrics?ageRanges=${ages.join(',')}&brandUuid=${brandId}&genders=${genders.join(',')}&type=${type}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
    const { body: { value } } = await get(authenticationToken, locale, url);
    result[metrics[type]] = value;
  }
  // { brandSubscriptions: 123, ... }
  return result;
}
