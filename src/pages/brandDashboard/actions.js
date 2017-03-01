import { fetchTopMedia } from '../../actions/brandDashboard';

// Action types
// ////////////

export const TOP_MEDIA_FETCH_START = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_START';
export const TOP_MEDIA_FETCH_ERROR = 'BRAND_DASHBOARD/TOP_MEDIA_FETCH_ERROR';

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
