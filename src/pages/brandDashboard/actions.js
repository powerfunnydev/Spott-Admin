import { fetchTopMedia, fetchTopPeople } from '../../actions/brandDashboard';
import { fetchAges, fetchGenders } from '../../actions/reporting';
import { locationSelector } from '../../selectors/global';

// Events are for every view the same.
export const loadAges = fetchAges;
export const loadGenders = fetchGenders;

// Action types
// ////////////

export const TOP_MEDIA_FETCH_START = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_START';
export const TOP_MEDIA_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_ERROR';

export const TOP_PEOPLE_FETCH_START = 'BRAND_DASHBOARD/TOP_PEOPLE_FETCH_START';
export const TOP_PEOPLE_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_PEOPLE_FETCH_ERROR';

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
