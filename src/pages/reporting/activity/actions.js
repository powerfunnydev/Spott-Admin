import moment from 'moment';
import { searchMedia as dataSearchMedia } from '../../../actions/media';
import {
  fetchAges, fetchEvents, fetchGenders, fetchTimelineData, fetchAgeData,
  fetchGenderData
} from '../../../actions/reporting';
import { currentEventsSelector, currentMediaSelector } from './selector';
import { locationSelector } from '../../../selectors/global';

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
        await dispatch(fetchTimelineData({ startDate, endDate, eventIds, mediumIds }));
        await dispatch(fetchAgeData({ startDate, endDate, eventIds, mediumIds }));
        await dispatch(fetchGenderData({ startDate, endDate, eventIds, mediumIds }));
      }
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}
