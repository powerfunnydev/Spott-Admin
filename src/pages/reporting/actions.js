import { formValueSelector } from 'redux-form/immutable';
import { searchMedia as dataSearchMedia } from '../../actions/media';

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

export function loadActivities () {
  return async (dispatch, getState) => {
    const state = getState();
    const dateRangeSelector = formValueSelector('reportingDateRange');
    const { dateFrom, dateTo } = dateRangeSelector(state, 'dateFrom', 'dateTo');

    const eventsFilterSelector = formValueSelector('reportingEventsFilter');
    const { events } = eventsFilterSelector(state, 'events');

    const mediaFilterSelector = formValueSelector('reportingMediaFilter');
    const { media } = mediaFilterSelector(state, 'media');

    try {
      dispatch({ dateFrom, dateTo, events, media, type: ACTIVITIES_FETCH_START });
      // return await dispatch(dataSearchSeries({ searchString }));
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}
