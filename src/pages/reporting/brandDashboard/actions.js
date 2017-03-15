import { fetchLanguages } from '../../../actions/language';
import { fetchAgeData, fetchDemographics, fetchGenderData, fetchTopMedia, fetchTopPeople } from '../../../actions/brandDashboard';
import { fetchAges, fetchEvents, fetchGenders } from '../../../actions/reporting';

// Events are for every view the same.
export const loadAges = fetchAges;

export const loadEvents = fetchEvents;
export const loadGenders = fetchGenders;
export const loadLanguages = fetchLanguages;

// Action types
// ////////////

export const TOP_MEDIA_FETCH_START = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_START';
export const TOP_MEDIA_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_ERROR';

export const TOP_PEOPLE_FETCH_START = 'BRAND_DASHBOARD/TOP_PEOPLE_FETCH_START';
export const TOP_PEOPLE_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_PEOPLE_FETCH_ERROR';

export const AGE_DATA_FETCH_START = 'BRAND_DASHBOARD/AGE_DATA_FETCH_START';
export const AGE_DATA_FETCH_ERROR = 'BRAND_DASHBOARD/AGE_DATA_FETCH_ERROR';

export const GENDER_DATA_FETCH_START = 'BRAND_DASHBOARD/GENDER_DATA_FETCH_START';
export const GENDER_DATA_FETCH_ERROR = 'BRAND_DASHBOARD/GENDER_DATA_FETCH_ERROR';

export const DEMOGRAPHICS_FETCH_START = 'BRAND_DASHBOARD/DEMOGRAPHICS_FETCH_START';
export const DEMOGRAPHICS_FETCH_ERROR = 'BRAND_DASHBOARD/DEMOGRAPHICS_FETCH_ERROR';

export function loadTopMedia (query) {
  return async (dispatch) => {
    try {
      dispatch({ ...query, type: TOP_MEDIA_FETCH_START });
      return await dispatch(fetchTopMedia());
    } catch (error) {
      dispatch({ ...query, error, type: TOP_MEDIA_FETCH_ERROR });
    }
  };
}

export function loadTopPeople (query) {
  return async (dispatch) => {
    try {
      dispatch({ ...query, type: TOP_PEOPLE_FETCH_START });
      return await dispatch(fetchTopPeople());
    } catch (error) {
      dispatch({ ...query, error, type: TOP_PEOPLE_FETCH_ERROR });
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
