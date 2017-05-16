import moment from 'moment';
// import { fetchLanguages } from '../../../actions/language';
import {
  fetchAgeData, fetchDateData, fetchBrandDashboardEvents,
  fetchGenderData, fetchKeyMetrics, fetchTopMedia, fetchTopPeople, fetchTopProducts,
  fetchTopCommercials, fetchLocationData
} from '../../../actions/brandDashboard';
import { fetchBrand as dataFetchBrand, searchBrands as dataSearchBrands } from '../../../actions/brand';
import { fetchAges, fetchGenders } from '../../../actions/reporting';
import { locationSelector } from '../../../selectors/global';
import { createSearchAction } from '../../../utils';
import { currentAgesSelector, currentBrandSelector, currentBrandActivityEventsSelector, currentBrandActivityByRegionEventSelector, currentGendersSelector, currentLanguagesSelector } from './selector';

// Events are for every view the same.
export const loadAges = fetchAges;

export const loadEvents = fetchBrandDashboardEvents;
export const loadGenders = fetchGenders;
export const fetchBrand = dataFetchBrand;
// export const loadLanguages = fetchLanguages;

// Action types
// ////////////

export const CLEAR_BRAND_DASHBOARD = 'BRAND_DASHBOARD/CLEAR_BRAND_DASHBOARD';
export const BRAND_DASHBOARD_FETCH_ERROR = 'BRAND_DASHBOARD/BRAND_DASHBOARD_FETCH_ERROR';

export const BRANDS_SEARCH_START = 'BRAND_DASHBOARD/BRANDS_SEARCH_START';
export const BRANDS_SEARCH_ERROR = 'BRAND_DASHBOARD/BRANDS_SEARCH_ERROR';

export const searchBrands = createSearchAction(dataSearchBrands, BRANDS_SEARCH_START, BRANDS_SEARCH_ERROR);

export function loadKeyMetrics () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);

    if (brandId && query.endDate && query.startDate) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const languages = currentLanguagesSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = { ages, brandId, endDate, genders, languages, startDate };

      return await dispatch(fetchKeyMetrics(args));
    }
  };
}

export function loadDateData () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);
    const eventIds = currentBrandActivityEventsSelector(state);

    if (brandId && query.endDate && query.startDate && eventIds) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const languages = currentLanguagesSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = {
        ages,
        brandId,
        eventIds: eventIds.filter((e) => e !== 'undefined'),
        endDate,
        genders,
        languages,
        startDate
      };
      return await dispatch(fetchDateData(args));
    }
  };
}

export function loadLocationData () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);
    const eventId = currentBrandActivityByRegionEventSelector(state);

    if (brandId && query.endDate && query.startDate && eventId) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const languages = currentLanguagesSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = {
        ages,
        brandId,
        eventId,
        endDate,
        genders,
        languages,
        startDate
      };
      return await dispatch(fetchLocationData(args));
    }
  };
}

export function loadTopMedia () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);
    const eventIds = currentBrandActivityEventsSelector(state);

    if (brandId && query.endDate && query.startDate && eventIds) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = {
        ages,
        brandId,
        endDate,
        eventIds: eventIds.filter((e) => e !== 'undefined'),
        genders,
        sortDirection: query.topMediaSortDirection,
        sortField: query.topMediaSortField,
        startDate
      };
      return await dispatch(fetchTopMedia(args));
    }
  };
}

export function loadTopCommercials () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);
    const eventIds = currentBrandActivityEventsSelector(state);

    if (brandId && query.endDate && query.startDate && eventIds) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = {
        ages,
        brandId,
        endDate,
        eventIds: eventIds.filter((e) => e !== 'undefined'),
        genders,
        sortDirection: query.topCommercialsSortDirection,
        sortField: query.topCommercialsSortField,
        startDate
      };
      return await dispatch(fetchTopCommercials(args));
    }
  };
}

export function loadTopPeople () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);
    const eventIds = currentBrandActivityEventsSelector(state);

    if (brandId && query.endDate && query.startDate && eventIds) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = {
        ages,
        brandId,
        endDate,
        eventIds: eventIds.filter((e) => e !== 'undefined'),
        genders,
        sortDirection: query.topPeopleSortDirection,
        sortField: query.topPeopleSortField,
        startDate
      };
      return await dispatch(fetchTopPeople(args));
    }
  };
}

export function loadTopProducts () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);
    const eventIds = currentBrandActivityEventsSelector(state);

    if (brandId && query.endDate && query.startDate && eventIds) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = {
        ages,
        brandId,
        endDate,
        eventIds: eventIds.filter((e) => e !== 'undefined'),
        genders,
        sortDirection: query.topProductsSortDirection,
        sortField: query.topProductsSortField,
        startDate
      };
      return await dispatch(fetchTopProducts(args));
    }
  };
}

export function loadDemographics (query) {
  return async (dispatch) => {
    // try {
    //   dispatch({ ...query, type: TOP_PEOPLE_FETCH_START });
    //   return await dispatch(fetchDemographics());
    // } catch (error) {
    //   dispatch({ ...query, error, type: TOP_PEOPLE_FETCH_ERROR });
    // }
  };
}

export function loadAgeData () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);

    if (brandId && query.endDate && query.startDate) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const languages = currentLanguagesSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = { ages, brandId, endDate, genders, languages, startDate };

      return await dispatch(fetchAgeData(args));
    }
  };
}

export function loadGenderData () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const brandId = currentBrandSelector(state);

    if (brandId && query.endDate && query.startDate) {
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const languages = currentLanguagesSelector(state);
      const endDate = moment(query.endDate);
      const startDate = moment(query.startDate);

      const args = { ages, brandId, endDate, genders, languages, startDate };

      return await dispatch(fetchGenderData(args));
    }
  };
}
