import { fromJS } from 'immutable';
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

export default (state = fromJS({
  ageData: {},
  brandSubscriptions: { data: [] },
  characterSubscriptions: { data: [] },
  genderData: {},
  mediumSubscriptions: { data: [] },
  mediumSyncs: { data: [] },
  productViews: { data: [] },
  timelineData: {}
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
      return fetchStart(state, [ 'brandSubscriptions' ]);
    case actions.BRAND_SUBSCRIPTIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'brandSubscriptions' ], action.data);
    case actions.BRAND_SUBSCRIPTIONS_FETCH_ERROR:
      return fetchError(state, [ 'brandSubscriptions' ], action.error);

    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_START:
      return fetchStart(state, [ 'characterSubscriptions' ]);
    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'characterSubscriptions' ], action.data);
    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_ERROR:
      return fetchError(state, [ 'characterSubscriptions' ], action.error);

    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_START:
      return fetchStart(state, [ 'mediumSubscriptions' ]);
    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'mediumSubscriptions' ], action.data);
    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_ERROR:
      return fetchError(state, [ 'mediumSubscriptions' ], action.error);

    case actions.MEDIUM_SYNCS_FETCH_START:
      return fetchStart(state, [ 'mediumSyncs' ]);
    case actions.MEDIUM_SYNCS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'mediumSyncs' ], action.data);
    case actions.MEDIUM_SYNCS_FETCH_ERROR:
      return fetchError(state, [ 'mediumSyncs' ], action.error);

    case actions.PRODUCT_VIEWS_FETCH_START:
      return fetchStart(state, [ 'productViews' ]);
    case actions.PRODUCT_VIEWS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'productViews' ], action.data);
    case actions.PRODUCT_VIEWS_FETCH_ERROR:
      return fetchError(state, [ 'productViews' ], action.error);

    // Uninteresting actions
    default:
      return state;

  }
};
