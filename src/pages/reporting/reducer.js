import { fromJS } from 'immutable';
import { MEDIA_SEARCH_START } from './actions';
import {
  AGE_DATA_FETCH_START, AGE_DATA_FETCH_SUCCESS, AGE_DATA_FETCH_ERROR,
  GENDER_DATA_FETCH_START, GENDER_DATA_FETCH_SUCCESS, GENDER_DATA_FETCH_ERROR,
  TIMELINE_DATA_FETCH_START, TIMELINE_DATA_FETCH_SUCCESS, TIMELINE_DATA_FETCH_ERROR
} from '../../actions/reporting';
import { fetchStart, fetchSuccess, fetchError } from '../../reducers/utils';
/**
 * -> currentSeriesSearchString
 */
export default (state = fromJS({
  ageData: {},
  genderData: {},
  timelineData: {}
}), action) => {
  switch (action.type) {

    case MEDIA_SEARCH_START: // Autocompletion field of series selection
      return state.set('currentMediaSearchString', action.searchString);

    case AGE_DATA_FETCH_START:
      return state.setIn([ 'ageData', action.mediumId ], []);
    case AGE_DATA_FETCH_SUCCESS:
      return state.setIn([ 'ageData', action.mediumId ], action.data);
    case AGE_DATA_FETCH_ERROR:
      return state.setIn([ 'ageData', action.mediumId ], []);

    case GENDER_DATA_FETCH_START:
      return state.setIn([ 'genderData', action.mediumId ], []);
    case GENDER_DATA_FETCH_SUCCESS:
      return state.setIn([ 'genderData', action.mediumId ], action.data);
    case GENDER_DATA_FETCH_ERROR:
      return state.setIn([ 'genderData', action.mediumId ], []);

    case TIMELINE_DATA_FETCH_START:
      return state.setIn([ 'timelineData', action.mediumId ], []);
    case TIMELINE_DATA_FETCH_SUCCESS:
      return state.setIn([ 'timelineData', action.mediumId ], action.data);
    case TIMELINE_DATA_FETCH_ERROR:
      return state.setIn([ 'timelineData', action.mediumId ], []);

    // case CHARACTER_SUBSCRIPTIONS_FETCH_START:
    //   return state.set('characterSubscriptions', action.mediumId ], []);
    // case CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS:
    //   return state.setIn([ 'timelineData', action.mediumId ], action.data);
    // case CHARACTER_SUBSCRIPTIONS_FETCH_ERROR:
    //   return state.setIn([ 'timelineData', action.mediumId ], []);

    // Uninteresting actions
    default:
      return state;

  }
};
