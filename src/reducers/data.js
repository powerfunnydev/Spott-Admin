import { fromJS } from 'immutable';
import * as seriesActions from '../actions/series';
import * as mediaActions from '../actions/media';
import * as contentProducersActions from '../actions/contentProducers';
import * as reportingActions from '../actions/reporting';
import { serializeFilterHasContentProducers, searchStart, searchSuccess, searchError, fetchListStart, fetchListSuccess, fetchListError } from './utils';

export default (state = fromJS({
  entities: {
    ages: {},
    contentProducers: {},
    events: {},
    genders: {},
    media: {}
  },
  relations: {
    ages: {},
    events: {},
    filterHasContentProducers: {},
    genders: {},
    searchStringHasMedia: {},
    searchStringHasSeries: {}
  }
}), action) => {
  switch (action.type) {

    // Content producers
    // /////////////////

    case contentProducersActions.CONTENT_PRODUCERS_FETCH_START:
      return searchStart(state, 'filterHasContentProducers', serializeFilterHasContentProducers(action));
    case contentProducersActions.CONTENT_PRODUCERS_FETCH_SUCCESS:
      return searchSuccess(state, 'contentProducers', 'filterHasContentProducers', serializeFilterHasContentProducers(action), action.data.data);
    case contentProducersActions.CONTENT_PRODUCERS_FETCH_ERROR:
      return searchError(state, 'filterHasContentProducers', serializeFilterHasContentProducers(action), action.error);

    // Media
    // /////

    case mediaActions.MEDIA_SEARCH_START:
      return searchStart(state, 'searchStringHasMedia', action.searchString);
    case mediaActions.MEDIA_SEARCH_SUCCESS:
      return searchSuccess(state, 'media', 'searchStringHasMedia', action.searchString, action.data);
    case mediaActions.MEDIA_SEARCH_ERROR:
      return searchError(state, 'searchStringHasMedia', action.searchString, action.error);

    // Reporting
    // /////////

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

    // Series
    // //////

    case seriesActions.SERIES_SEARCH_START:
      return searchStart(state, 'searchStringHasSeries', action.searchString);
    case seriesActions.SERIES_SEARCH_SUCCESS:
      return searchSuccess(state, 'media', 'searchStringHasSeries', action.searchString, action.data);
    case seriesActions.SERIES_SEARCH_ERROR:
      return searchError(state, 'searchStringHasSeries', action.searchString, action.error);

    default:
      return state;
  }
};
