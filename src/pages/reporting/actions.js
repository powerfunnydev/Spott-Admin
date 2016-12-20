import moment from 'moment';
import { searchMedia as dataSearchMedia } from '../../actions/media';
import {
  fetchAges, fetchEvents, fetchGenders, fetchTimelineData, fetchAgeData,
  fetchBrandSubscriptions, fetchMediumSyncs, fetchMediumSubscriptions,
  fetchGenderData, fetchCharacterSubscriptions, fetchProductBuys,
  fetchProductImpressions, fetchProductViews
} from '../../actions/reporting';
import { currentAgesSelector, currentGendersSelector, currentEventsSelector, currentMediaSelector } from './selector';
import { locationSelector } from '../../selectors/global';

// Action types
// ////////////

export const MEDIA_SEARCH_START = 'REPORTING/MEDIA_SEARCH_START';
export const MEDIA_SEARCH_ERROR = 'REPORTING/MEDIA_SEARCH_ERROR';

export const ACTIVITIES_FETCH_START = 'REPORTING/ACTIVITIES_FETCH_START';
export const ACTIVITIES_FETCH_ERROR = 'REPORTING/ACTIVITIES_FETCH_ERROR';

export const CLEAR_RANKINGS = 'REPORTING/CLEAR_RANKINGS';
export const SAVE_FILTER_QUERY = 'REPORTING/SAVE_FILTER_QUERY';

export function searchMedia (searchString = '') {
  return async (dispatch, getState) => {
    try {
      dispatch({ searchString, type: MEDIA_SEARCH_START });
      return await dispatch(dataSearchMedia({ searchString }));
    } catch (error) {
      dispatch({ error, searchString, type: MEDIA_SEARCH_ERROR });
    }
  };
}

// Events are for every view the same.
export const loadAges = fetchAges;
export const loadEvents = fetchEvents;
export const loadGenders = fetchGenders;

export function loadActivities () {
  return async (dispatch, getState) => {
    const state = getState();
    const query = locationSelector(state).query;

    try {
      dispatch({ type: SAVE_FILTER_QUERY, query });

      if (query.endDate && query.events && query.startDate && query.media) {
        const endDate = moment(query.endDate);
        const startDate = moment(query.startDate);
        const eventIds = currentEventsSelector(state);
        const mediumIds = currentMediaSelector(state);

        // We need to load the genders to show in the gender chart.
        await dispatch(loadGenders());
        dispatch(fetchTimelineData({ startDate, endDate, eventIds, mediumIds }));
        // dispatch(fetchAgeData({ startDate, endDate, eventIds, mediumIds }));
        // dispatch(fetchGenderData({ startDate, endDate, eventIds, mediumIds }));
      }
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}

export function loadRankings () {
  return async (dispatch, getState) => {
    const state = getState();

    const ages = currentAgesSelector(state);
    const genders = currentGendersSelector(state);
    const mediumIds = currentMediaSelector(state);

    const query = locationSelector(state).query;

    try {
      dispatch({ type: SAVE_FILTER_QUERY, query });
      dispatch({ type: CLEAR_RANKINGS });
      dispatch(fetchBrandSubscriptions({ ages, genders, mediumIds, page: 0 }));
      dispatch(fetchCharacterSubscriptions({ ages, genders, mediumIds, page: 0 }));
      dispatch(fetchMediumSubscriptions({ ages, genders, mediumIds, page: 0 }));
      dispatch(fetchMediumSyncs({ ages, genders, mediumIds, page: 0 }));
      dispatch(fetchProductBuys({ ages, genders, mediumIds, page: 0 }));
      dispatch(fetchProductImpressions({ ages, genders, mediumIds, page: 0 }));
      dispatch(fetchProductViews({ ages, genders, mediumIds, page: 0 }));

      // return await dispatch(dataSearchSeries({ searchString }));
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}

function createLoadRankings (fetch) {
  return (page = 0) => {
    return async (dispatch, getState) => {
      const state = getState();
      const ages = currentAgesSelector(state);
      const genders = currentGendersSelector(state);
      const mediumIds = currentMediaSelector(state);
      return await dispatch(fetch({ ages, genders, mediumIds, page }));
    };
  };
}

export const loadBrandSubscriptions = createLoadRankings(fetchBrandSubscriptions);
export const loadCharacterSubscriptions = createLoadRankings(fetchCharacterSubscriptions);
export const loadMediumSubscriptions = createLoadRankings(fetchMediumSubscriptions);
export const loadMediumSyncs = createLoadRankings(fetchMediumSyncs);
export const loadProductBuys = createLoadRankings(fetchProductBuys);
export const loadProductViews = createLoadRankings(fetchProductViews);
export const loadProductImpressions = createLoadRankings(fetchProductImpressions);
