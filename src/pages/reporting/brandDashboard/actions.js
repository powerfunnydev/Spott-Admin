import moment from 'moment';
import { fetchLanguages } from '../../../actions/language';
import { fetchAgeData, fetchDateData, fetchDemographics, fetchBrandDashboardEvents, fetchGenderData, fetchKeyMetrics, fetchTopMedia, fetchTopPeople, fetchTopProducts } from '../../../actions/brandDashboard';
import { fetchAges, fetchEvents, fetchGenders } from '../../../actions/reporting';
import { locationSelector } from '../../../selectors/global';
import { currentAgesSelector, currentBrandActivityEventsSelector, currentGendersSelector, currentLanguagesSelector } from './selector';

// Events are for every view the same.
export const loadAges = fetchAges;

export const loadEvents = fetchBrandDashboardEvents;
export const loadGenders = fetchGenders;
export const loadLanguages = fetchLanguages;

// Action types
// ////////////

export const TOP_MEDIA_FETCH_START = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_START';
export const TOP_MEDIA_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_ERROR';

export const TOP_PEOPLE_FETCH_START = 'BRAND_DASHBOARD/TOP_PEOPLE_FETCH_START';
export const TOP_PEOPLE_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_PEOPLE_FETCH_ERROR';

export const TOP_PRODUCTS_FETCH_START = 'BRAND_DASHBOARD/TOP_PRODUCTS_FETCH_START';
export const TOP_PRODUCTS_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_PRODUCTS_FETCH_ERROR';

export const AGE_DATA_FETCH_START = 'BRAND_DASHBOARD/AGE_DATA_FETCH_START';
export const AGE_DATA_FETCH_ERROR = 'BRAND_DASHBOARD/AGE_DATA_FETCH_ERROR';

export const GENDER_DATA_FETCH_START = 'BRAND_DASHBOARD/GENDER_DATA_FETCH_START';
export const GENDER_DATA_FETCH_ERROR = 'BRAND_DASHBOARD/GENDER_DATA_FETCH_ERROR';

export const DATA_DATA_FETCH_START = 'BRAND_DASHBOARD/DATA_DATA_FETCH_START';
export const DATA_DATA_FETCH_ERROR = 'BRAND_DASHBOARD/DATA_DATA_FETCH_ERROR';

export const DEMOGRAPHICS_FETCH_START = 'BRAND_DASHBOARD/DEMOGRAPHICS_FETCH_START';
export const DEMOGRAPHICS_FETCH_ERROR = 'BRAND_DASHBOARD/DEMOGRAPHICS_FETCH_ERROR';

// Action types
// ////////////

export const CLEAR_BRAND_DASHBOARD = 'BRAND_DASHBOARD/CLEAR_BRAND_DASHBOARD';
export const BRAND_DASHBOARD_FETCH_ERROR = 'BRAND_DASHBOARD/BRAND_DASHBOARD_FETCH_ERROR';

const brandId = '83af3531-8235-46bc-9071-dcee03a338cd';

// Load all brand dashboard data based on the query in the url.
// export function loadBrandDashboard () {
//   return async (dispatch, getState) => {
//     const state = getState();
//     const query = locationSelector(state).query;
//     try {
//       if (query.endDate && query.startDate) {
//         const ages = currentAgesSelector(state);
//         const genders = currentGendersSelector(state);
//         const languages = currentLanguagesSelector(state);
//         const endDate = moment(query.endDate);
//         const startDate = moment(query.startDate);
//
//         const args = { ages, brandId, endDate, genders, languages, startDate };
//
//         return await dispatch(fetchKeyMetrics(args));
//       }
//     } catch (error) {
//       dispatch({ error, type: BRAND_DASHBOARD_FETCH_ERROR });
//     }
//   };
// }

export function loadKeyMetrics () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;

    if (query.endDate && query.startDate) {
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
    const eventIds = currentBrandActivityEventsSelector(state);

    if (query.endDate && query.startDate && eventIds) {
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

export function loadTopMedia () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const eventIds = currentBrandActivityEventsSelector(state);

    if (query.endDate && query.startDate && eventIds) {
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

export function loadTopPeople () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;
    const eventIds = currentBrandActivityEventsSelector(state);

    if (query.endDate && query.startDate && eventIds) {
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
    const eventIds = currentBrandActivityEventsSelector(state);

    if (query.endDate && query.startDate && eventIds) {
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
    try {
      dispatch({ ...query, type: TOP_PEOPLE_FETCH_START });
      return await dispatch(fetchDemographics());
    } catch (error) {
      dispatch({ ...query, error, type: TOP_PEOPLE_FETCH_ERROR });
    }
  };
}

export function loadAgeData (query) {
  return async (dispatch) => {
    try {
      dispatch({ ...query, type: AGE_DATA_FETCH_START });
      return await dispatch(fetchAgeData());
    } catch (error) {
      dispatch({ ...query, error, type: AGE_DATA_FETCH_ERROR });
    }
  };
}

export function loadGenderData (query) {
  return async (dispatch) => {
    try {
      dispatch({ ...query, type: GENDER_DATA_FETCH_START });
      return await dispatch(fetchGenderData());
    } catch (error) {
      dispatch({ ...query, error, type: GENDER_DATA_FETCH_ERROR });
    }
  };
}
