import { formValueSelector } from 'redux-form/immutable';
import { searchMedia as dataSearchMedia } from '../../actions/media';
import { fetchAges, fetchEvents, fetchGenders, fetchTimelineData, fetchAgeData, fetchGenderData } from '../../actions/reporting';

// Action types
// ////////////

export const MEDIA_SEARCH_START = 'REPORTING/MEDIA_SEARCH_START';
export const MEDIA_SEARCH_ERROR = 'REPORTING/MEDIA_SEARCH_ERROR';

export const ACTIVITIES_FETCH_START = 'REPORTING/ACTIVITIES_FETCH_START';
export const ACTIVITIES_FETCH_ERROR = 'REPORTING/ACTIVITIES_FETCH_ERROR';

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

    const eventFilterSelector = formValueSelector('reportingActivityFilter');
    const { endDate, event, startDate } = eventFilterSelector(state, 'endDate', 'event', 'startDate');

    const mediaFilterSelector = formValueSelector('reportingMediaFilter');
    const media = mediaFilterSelector(state, 'media');

    try {
      if (endDate && event && startDate && media) {
        for (const mediumId of media) {
          dispatch(fetchTimelineData({ startDate, endDate, eventType: event, mediumId }));
          dispatch(fetchAgeData({ startDate, endDate, eventType: event, mediumId }));
          dispatch(fetchGenderData({ startDate, endDate, eventType: event, mediumId }));
        }
      }

      // return await dispatch(dataSearchSeries({ searchString }));
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}
