import { get } from './request';
import { transformTopMedia, transformTopPeople, transformTopProduct, transformKeyMetrics, transformAgeRange } from './transformers';

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

export async function fetchTopMedia (baseUrl, authenticationToken, locale, { ages, brandId, eventIds, endDate, genders, startDate, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/report/reports/brands/topMedia?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventIds.join(',')}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformTopMedia);
  return body;
}

export async function fetchTopPeople (baseUrl, authenticationToken, locale, { ages, brandId, eventIds, endDate, genders, startDate, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/report/reports/brands/topCharacters?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventIds.join(',')}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchTopProducts (baseUrl, authenticationToken, locale, { ages, brandId, eventIds, endDate, genders, startDate, sortDirection, sortField }) {
  let url = `${baseUrl}/v004/report/reports/brands/topProducts?ageRanges=${ages.join(',')}&brandUuid=${brandId}&currency=EUR&eventType=${eventIds.join(',')}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    url = url.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformTopProduct);
  return body;
}

export async function fetchDemographics (baseUrl, authenticationToken, locale) {
  const searchUrl = `${baseUrl}/v004/media/characters`;
  const { body } = await get(authenticationToken, locale, searchUrl);
  body.data = body.data.map(transformTopPeople);
  return body;
}

export async function fetchAgeData (baseUrl, authenticationToken, locale, { ages, brandId, endDate, genders, startDate }) {
  const url = `${baseUrl}/v004/report/reports/brands/ageGraph?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=BRAND_SUBSCRIPTIONS&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(transformAgeRange);
  return body;
}

export async function fetchGenderData (baseUrl, authenticationToken, locale, { ages, brandId, endDate, genders, startDate }) {
  const url = `${baseUrl}/v004/report/reports/brands/genderGraph?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=BRAND_SUBSCRIPTIONS&gender=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  const { body } = await get(authenticationToken, locale, url);
  body.data = body.data.map(({ gender, value }) => ({ id: gender, value }));
  return body;
}

export async function fetchDateData (baseUrl, authenticationToken, locale, { ages, brandId, eventIds, endDate, genders, startDate }) {
  const eventData = {};
  for (const eventId of eventIds) {
    const url = `${baseUrl}/v004/report/reports/brands/dateGraph?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventId}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
    const { body } = await get(authenticationToken, locale, url);
    body.data.pop();
    eventData[eventId] = body.data;
  }

  const url = `${baseUrl}/v004/report/reports/brands/userGraph?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventIds.join(',')}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  const { body: { data: userData } } = await get(authenticationToken, locale, url);
  userData.pop();
  return {
    eventData,
    userData
  };
}

export async function fetchLocationData (baseUrl, authenticationToken, locale, { ages, brandId, eventId, endDate, genders, startDate }) {
  const url = `${baseUrl}/v004/report/reports/brands/locationData?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventId}&gender=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&pageSize=1000&page=0`;
  const { body: { data, pageCount } } = await get(authenticationToken, locale, url);

  let result = data;
  for (let i = 1; i < pageCount; i++) {
    const url = `${baseUrl}/v004/report/reports/brands/locationData?ageRanges=${ages.join(',')}&brandUuid=${brandId}&eventType=${eventId}&gender=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}&pageSize=1000&page=${i}`;
    const { body: { data } } = await get(authenticationToken, locale, url);
    result = result.concat(data);
  }
  return { data: result };
}

export async function fetchKeyMetrics (baseUrl, authenticationToken, locale, { ages, brandId, endDate, genders, startDate }) {
  const url = `${baseUrl}/v004/report/reports/brands/activityMetrics?ageRanges=${ages.join(',')}&brandUuid=${brandId}&genders=${genders.join(',')}&startDate=${encodeURIComponent(startDate.format())}&endDate=${encodeURIComponent(endDate.clone().add(1, 'day').format())}`;
  const { body } = await get(authenticationToken, locale, url);
  return transformKeyMetrics(body);
}
