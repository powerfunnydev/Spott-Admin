import { Map } from 'immutable';
import { MEDIA_SEARCH_START } from './actions';
import * as actions from '../../actions/reporting';
import { fetchStart, fetchSuccess, fetchError } from '../../reducers/utils';

function fetchActivityDataStart (state, field, { mediumIds }) {
  let newState = state;
  for (const mediumId of mediumIds) {
    newState = fetchStart(newState, [ field, mediumId ]);
  }
  return newState;
}

// data is an object with key: mediumId, value: list of data.
function fetchActivityDataSuccess (state, field, { data, mediumIds }) {
  let newState = state;
  for (const mediumId of mediumIds) {
    newState = fetchSuccess(newState, [ field, mediumId ], data[mediumId]);
  }
  return newState;
}

function fetchActivityDataError (state, field, { error, mediumIds }) {
  let newState = state;
  for (const mediumId of mediumIds) {
    newState = fetchError(newState, [ field, mediumId ], error);
  }
  return newState;
}

export default (state = Map({
  ageData: Map({}),
  brandSubscriptions: [],
  characterSubscriptions: [],
  genderData: Map({}),
  mediumSubscriptions: [],
  productViews: [],
  timelineData: Map({})
}), action) => {
  switch (action.type) {

    case MEDIA_SEARCH_START: // Autocompletion field of series selection
      return state.set('currentMediaSearchString', action.searchString);

    case actions.AGE_DATA_FETCH_START:
      return fetchActivityDataStart(state, 'ageData', action);
    case actions.AGE_DATA_FETCH_SUCCESS:
      return fetchActivityDataSuccess(state, 'ageData', action);
    case actions.AGE_DATA_FETCH_ERROR:
      return fetchActivityDataError(state, 'ageData', action);

    case actions.GENDER_DATA_FETCH_START:
      return fetchActivityDataStart(state, 'genderData', action);
    case actions.GENDER_DATA_FETCH_SUCCESS:
      return fetchActivityDataSuccess(state, 'genderData', action);
    case actions.GENDER_DATA_FETCH_ERROR:
      return fetchActivityDataError(state, 'genderData', action);

    case actions.TIMELINE_DATA_FETCH_START:
      return fetchActivityDataStart(state, 'timelineData', action);
    case actions.TIMELINE_DATA_FETCH_SUCCESS:
      return fetchActivityDataSuccess(state, 'timelineData', action);
    case actions.TIMELINE_DATA_FETCH_ERROR:
      return fetchActivityDataError(state, 'timelineData', action);

    case actions.BRAND_SUBSCRIPTIONS_FETCH_START:
      return state;
      // .set('brandSubscriptions', []);
    case actions.BRAND_SUBSCRIPTIONS_FETCH_SUCCESS:
      return state.set('brandSubscriptions', action.data);
    case actions.BRAND_SUBSCRIPTIONS_FETCH_ERROR:
      return state.set('brandSubscriptions', []);

    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_START:
      return state;
      // .set('characterSubscriptions', []);
    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS:
      return state.set('characterSubscriptions', action.data);
    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_ERROR:
      return state.set('characterSubscriptions', []);

    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_START:
      return state;
      // .set('mediumSubscriptions', []);
    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_SUCCESS:
      return state.set('mediumSubscriptions', action.data);
    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_ERROR:
      return state.set('mediumSubscriptions', []);

    case actions.PRODUCT_VIEWS_FETCH_START:
      return state;
      // .set('mediumSubscriptions', []);
    case actions.PRODUCT_VIEWS_FETCH_SUCCESS:
      return state.set('productViews', action.data);
    case actions.PRODUCT_VIEWS_FETCH_ERROR:
      return state.set('productViews', []);

    // Uninteresting actions
    default:
      return state;

  }
};
