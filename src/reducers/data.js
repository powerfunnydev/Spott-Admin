import { fromJS } from 'immutable';
import * as mediaActions from '../actions/media';
import * as reportingActions from '../actions/reporting';
import { searchStart, searchSuccess, searchError, fetchListStart, fetchListSuccess, fetchListError } from './utils';

export default (state = fromJS({
  entities: {
    ages: {},
    events: {},
    genders: {},
    media: {}
  },
  relations: {
    ages: {},
    events: {},
    genders: {},
    searchStringHasMedia: {}
  }
}), action) => {
  switch (action.type) {
    case mediaActions.MEDIA_SEARCH_START:
      return searchStart(state, 'searchStringHasMedia', action.searchString);
    case mediaActions.MEDIA_SEARCH_SUCCESS:
      return searchSuccess(state, 'media', 'searchStringHasMedia', action.searchString, action.data);
    case mediaActions.MEDIA_SEARCH_ERROR:
      return searchError(state, 'searchStringHasMedia', action.searchString, action.error);

    case reportingActions.AGES_FETCH_START:
      return fetchListStart(state, 'ages');
    case reportingActions.AGES_FETCH_SUCCESS:
      return fetchListSuccess(state, 'ages', 'ages', action.data);
    case reportingActions.AGES_FETCH_ERROR:
      return fetchListError(state, 'ages', action.error);

    case reportingActions.EVENTS_FETCH_START:
      return fetchListStart(state, 'events');
    case reportingActions.EVENTS_FETCH_SUCCESS:
      return fetchListSuccess(state, 'events', 'events', action.data);
    case reportingActions.EVENTS_FETCH_ERROR:
      return fetchListError(state, 'events', action.error);

    case reportingActions.GENDERS_FETCH_START:
      return fetchListStart(state, 'genders');
    case reportingActions.GENDERS_FETCH_SUCCESS:
      return fetchListSuccess(state, 'genders', 'genders', action.data);
    case reportingActions.GENDERS_FETCH_ERROR:
      return fetchListError(state, 'genders', action.error);
    default:
      return state;
  }
};
