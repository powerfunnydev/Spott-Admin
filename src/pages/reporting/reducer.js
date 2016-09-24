import { Map } from 'immutable';
import { MEDIA_SEARCH_START } from './actions';
import * as actions from '../../actions/reporting';

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
      return state.setIn([ 'ageData', action.mediumId ], []);
    case actions.AGE_DATA_FETCH_SUCCESS:
      return state.setIn([ 'ageData', action.mediumId ], action.data);
    case actions.AGE_DATA_FETCH_ERROR:
      return state.setIn([ 'ageData', action.mediumId ], []);

    case actions.GENDER_DATA_FETCH_START:
      return state.setIn([ 'genderData', action.mediumId ], []);
    case actions.GENDER_DATA_FETCH_SUCCESS:
      return state.setIn([ 'genderData', action.mediumId ], action.data);
    case actions.GENDER_DATA_FETCH_ERROR:
      return state.setIn([ 'genderData', action.mediumId ], []);

    case actions.TIMELINE_DATA_FETCH_START:
      return state.setIn([ 'timelineData', action.mediumId ], []);
    case actions.TIMELINE_DATA_FETCH_SUCCESS:
      return state.setIn([ 'timelineData', action.mediumId ], action.data);
    case actions.TIMELINE_DATA_FETCH_ERROR:
      return state.setIn([ 'timelineData', action.mediumId ], []);

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
