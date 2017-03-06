import { fromJS, Map } from 'immutable';
import { CLEAR_RANKINGS, MEDIA_SEARCH_START, SAVE_FILTER_QUERY } from './activity/actions';
import * as actions from '../../actions/reporting';
import { fetchError, fetchStart } from '../../reducers/utils';
import { LOADED } from '../../constants/statusTypes';

export function fetchSuccess (state, path, data) {
  return state.setIn(path, Map({ ...data, _error: null, _status: LOADED }));
}

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
    newState = newState.setIn([ field, mediumId ], Map({ data: data[mediumId], _status: LOADED }));
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
  currentBrandSubscriptionsPage: 0,
  currentCharacterSubscriptionsPage: 0,
  currentMediumSubscriptionsPage: 0,
  currentMediumSyncsPage: 0,
  currentProductBuysPage: 0,
  currentProductImpressionsPage: 0,
  currentProductViewsPage: 0,
  brandSubscriptions: {},
  characterSubscriptions: {},
  genderData: {},
  mediumSubscriptions: {},
  mediumSyncs: {},
  productBuys: {},
  productImpressions: {},
  productViews: {},
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

    case CLEAR_RANKINGS:
      return state
        .setIn([ 'brandSubscriptions' ], Map())
        .setIn([ 'characterSubscriptions' ], Map())
        .setIn([ 'mediumSubscriptions' ], Map())
        .setIn([ 'mediumSyncs' ], Map())
        .setIn([ 'productImpressions' ], Map())
        .setIn([ 'productViews' ], Map());
    case SAVE_FILTER_QUERY:
      return state.set('filterQuery', action.query);

    case actions.BRAND_SUBSCRIPTIONS_FETCH_START:
      return fetchStart(state, [ 'brandSubscriptions', action.page ])
        .set('currentBrandSubscriptionsPage', action.page);
    case actions.BRAND_SUBSCRIPTIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'brandSubscriptions', action.data.page ], action.data);
    case actions.BRAND_SUBSCRIPTIONS_FETCH_ERROR:
      return fetchError(state, [ 'brandSubscriptions', action.page ], action.error);

    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_START:
      return fetchStart(state, [ 'characterSubscriptions', action.page ])
        .set('currentCharacterSubscriptionsPage', action.page);
    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'characterSubscriptions', action.data.page ], action.data);
    case actions.CHARACTER_SUBSCRIPTIONS_FETCH_ERROR:
      return fetchError(state, [ 'characterSubscriptions', action.page ], action.error);

    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_START:
      return fetchStart(state, [ 'mediumSubscriptions', action.page ])
        .set('currentMediumSubscriptionsPage', action.page);
    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'mediumSubscriptions', action.data.page ], action.data);
    case actions.MEDIUM_SUBSCRIPTIONS_FETCH_ERROR:
      return fetchError(state, [ 'mediumSubscriptions', action.page ], action.error);

    case actions.MEDIUM_SYNCS_FETCH_START:
      return fetchStart(state, [ 'mediumSyncs', action.page ])
        .set('currentMediumSyncsPage', action.page);
    case actions.MEDIUM_SYNCS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'mediumSyncs', action.data.page ], action.data);
    case actions.MEDIUM_SYNCS_FETCH_ERROR:
      return fetchError(state, [ 'mediumSyncs', action.page ], action.error);

    case actions.PRODUCT_BUYS_FETCH_START:
      return fetchStart(state, [ 'productBuys', action.page ])
        .set('currentProductBuysPage', action.page);
    case actions.PRODUCT_BUYS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'productBuys', action.data.page ], action.data);
    case actions.PRODUCT_BUYS_FETCH_ERROR:
      return fetchError(state, [ 'productBuys', action.page ], action.error);

    case actions.PRODUCT_IMPRESSIONS_FETCH_START:
      return fetchStart(state, [ 'productImpressions', action.page ])
        .set('currentProductImpressionsPage', action.page);
    case actions.PRODUCT_IMPRESSIONS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'productImpressions', action.data.page ], action.data);
    case actions.PRODUCT_IMPRESSIONS_FETCH_ERROR:
      return fetchError(state, [ 'productImpressions', action.page ], action.error);

    case actions.PRODUCT_VIEWS_FETCH_START:
      return fetchStart(state, [ 'productViews', action.page ])
        .set('currentProductViewsPage', action.page);
    case actions.PRODUCT_VIEWS_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'productViews', action.data.page ], action.data);
    case actions.PRODUCT_VIEWS_FETCH_ERROR:
      return fetchError(state, [ 'productViews', action.page ], action.error);

    // Uninteresting actions
    default:
      return state;

  }
};
