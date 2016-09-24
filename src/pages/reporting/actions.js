import { change, formValueSelector } from 'redux-form/immutable';
import { searchMedia as dataSearchMedia } from '../../actions/media';
import { fetchAges, fetchEvents, fetchGenders, fetchProductViews, fetchTimelineData, fetchAgeData, fetchBrandSubscriptions, fetchMediumSubscriptions, fetchGenderData, fetchCharacterSubscriptions } from '../../actions/reporting';

const rankingsFilterSelector = formValueSelector('reportingRankingsFilter');
const mediaFilterSelector = formValueSelector('reportingMediaFilter');

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

    // Get the current selected media (series/movies/commercials).
    const media = mediaFilterSelector(state, 'media');

    // Get the date range and the event type.
    const eventFilterSelector = formValueSelector('reportingActivityFilter');
    const { endDate, event, startDate } = eventFilterSelector(state, 'endDate', 'event', 'startDate');

    try {
      if (endDate && event && startDate && media) {
        // We need to load the genders to show in the gender chart.
        await dispatch(loadGenders());
        for (const mediumId of media) {
          await dispatch(fetchTimelineData({ startDate, endDate, eventType: event, mediumId }));
          await dispatch(fetchAgeData({ startDate, endDate, eventType: event, mediumId }));
          await dispatch(fetchGenderData({ startDate, endDate, eventType: event, mediumId }));
        }
      }
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}

export function loadRankings () {
  return async (dispatch, getState) => {
    const state = getState();

    const { ages, genders } = rankingsFilterSelector(state, 'ages', 'genders');

    const media = mediaFilterSelector(state, 'media');

    try {
      if (ages && genders && media) {
        console.warn('LOAD RANKINGS');
        await dispatch(fetchBrandSubscriptions({ ages, genders, mediumIds: media }));
        await dispatch(fetchCharacterSubscriptions({ ages, genders, mediumIds: media }));
        await dispatch(fetchMediumSubscriptions({ ages, genders, mediumIds: media }));
        await dispatch(fetchProductViews({ ages, genders, mediumIds: media }));
      }

      // return await dispatch(dataSearchSeries({ searchString }));
    } catch (error) {
      dispatch({ error, type: ACTIVITIES_FETCH_ERROR });
    }
  };
}

export function initializeRankingsFilterForm (ages, genders) {
  return async (dispatch, getState) => {
    const state = getState();
    const { ages: currentAges, genders: currentGenders } = rankingsFilterSelector(state, 'ages', 'genders');

    if (!currentAges || currentAges.length === 0) {
      const ageIds = ages.map(({ id }) => id);
      dispatch(change('reportingRankingsFilter', 'ages', ageIds));
    }

    if (!currentGenders || currentGenders.length === 0) {
      const genderIds = genders.map(({ id }) => id);
      dispatch(change('reportingRankingsFilter', 'genders', genderIds));
    }
  };
}
