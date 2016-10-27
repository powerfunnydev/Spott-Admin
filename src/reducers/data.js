import { fromJS } from 'immutable';
import * as broadcastChannelActions from '../actions/broadcastChannel';
import * as episodeActions from '../actions/episode';
import * as seasonActions from '../actions/season';
import * as mediaActions from '../actions/media';
import * as broadcastersActions from '../actions/broadcasters';
import * as contentProducersActions from '../actions/contentProducer';
import * as reportingActions from '../actions/reporting';
import * as tvGuideActions from '../actions/tvGuide';
import { serializeFilterHasBroadcasters, serializeFilterHasTvGuideEntries, serializeFilterHasContentProducers, serializeFilterHasEpisodes, serializeFilterHasSeries, fetchStart, fetchSuccess, fetchError, searchStart, searchSuccess, searchError, fetchListStart, fetchListSuccess, fetchListError } from './utils';

export default (state = fromJS({
  entities: {
    ages: {},
    broadcasters: {},
    broadcastChannels: {},
    contentProducers: {},
    events: {},
    genders: {},
    listMedia: {},
    tvGuideEntries: {}
  },
  relations: {
    ages: {},
    events: {},
    filterHasEpisodes: {},
    filterHasBroadcasters: {},
    filterHasContentProducers: {},
    filterHasSeasons: {},
    filterHasTvGuideEntries: {},
    genders: {},
    searchStringHasBroadcastChannels: {},
    searchStringHasBroadcasters: {},
    searchStringHasMedia: {},
    searchStringHasSeries: {}
  }
}), action) => {
  switch (action.type) {

    // Broadcasters
    // /////////////////
    case broadcastersActions.BROADCASTERS_ENTRY_FETCH_START:
      return fetchStart(state, [ 'entities', 'broadcasters', action.broadcastersEntryId ]);
    case broadcastersActions.BROADCASTERS_ENTRY_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'broadcasters', action.broadcastersEntryId ], action.data);
    case broadcastersActions.BROADCASTERS_ENTRY_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'broadcasters', action.broadcastersEntryId ], action.error);

    case broadcastersActions.BROADCASTERS_FETCH_START:
      return searchStart(state, 'filterHasBroadcasters', serializeFilterHasBroadcasters(action));
    case broadcastersActions.BROADCASTERS_FETCH_SUCCESS:
      return searchSuccess(state, 'broadcasters', 'filterHasBroadcasters', serializeFilterHasBroadcasters(action), action.data.data);
    case broadcastersActions.BROADCASTERS_FETCH_ERROR:
      return searchError(state, 'filterHasBroadcasters', serializeFilterHasBroadcasters(action), action.error);

    case broadcastersActions.BROADCASTERS_SEARCH_START:
      return searchStart(state, 'searchStringHasBroadcasters', action.searchString);
    case broadcastersActions.BROADCASTERS_SEARCH_SUCCESS:
      return searchSuccess(state, 'broadcasters', 'searchStringHasBroadcasters', action.searchString, action.data);
    case broadcastersActions.BROADCASTERS_SEARCH_ERROR:
      return searchError(state, 'searchStringHasBroadcasters', action.searchString, action.error);

    // Content producers
    // /////////////////

    case contentProducersActions.CONTENT_PRODUCER_FETCH_START:
      return searchStart(state, 'filterHasContentProducers', serializeFilterHasContentProducers(action));
    case contentProducersActions.CONTENT_PRODUCER_FETCH_SUCCESS:
      return searchSuccess(state, 'contentProducers', 'filterHasContentProducers', serializeFilterHasContentProducers(action), action.data.data);
    case contentProducersActions.CONTENT_PRODUCER_FETCH_ERROR:
      return searchError(state, 'filterHasContentProducers', serializeFilterHasContentProducers(action), action.error);

    // Tv Guide
    // /////////////////

    case tvGuideActions.TV_GUIDE_ENTRIES_FETCH_START:
      return searchStart(state, 'filterHasTvGuideEntries', serializeFilterHasTvGuideEntries(action));
    case tvGuideActions.TV_GUIDE_ENTRIES_FETCH_SUCCESS:
      return searchSuccess(state, 'tvGuideEntries', 'filterHasTvGuideEntries', serializeFilterHasTvGuideEntries(action), action.data.data);
    case tvGuideActions.TV_GUIDE_ENTRIES_FETCH_ERROR:
      return searchError(state, 'filterHasTvGuideEntries', serializeFilterHasTvGuideEntries(action), action.error);

    case broadcastChannelActions.BROADCAST_CHANNEL_SEARCH_START:
      return searchStart(state, 'searchStringHasBroadcastChannels', action.searchString);
    case broadcastChannelActions.BROADCAST_CHANNEL_SEARCH_SUCCESS:
      return searchSuccess(state, 'broadcastChannels', 'searchStringHasBroadcastChannels', action.searchString, action.data);
    case broadcastChannelActions.BROADCAST_CHANNEL_SEARCH_ERROR:
      return searchError(state, 'searchStringHasBroadcastChannels', action.searchString, action.error);

    // Media
    // /////

    case episodeActions.EPISODES_SEARCH_START:
      return searchStart(state, 'filterHasSeasons', serializeFilterHasEpisodes(action));
    case episodeActions.EPISODES_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'filterHasEpisodes', serializeFilterHasEpisodes(action), action.data);
    case episodeActions.EPISODES_SEARCH_ERROR:
      return searchError(state, 'filterHasSeasons', serializeFilterHasEpisodes(action), action.error);

    case mediaActions.MEDIA_SEARCH_START:
      return searchStart(state, 'searchStringHasMedia', action.searchString);
    case mediaActions.MEDIA_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'searchStringHasMedia', action.searchString, action.data);
    case mediaActions.MEDIA_SEARCH_ERROR:
      return searchError(state, 'searchStringHasMedia', action.searchString, action.error);

    case seasonActions.SEASONS_SEARCH_START:
      return searchStart(state, 'filterHasSeasons', serializeFilterHasSeries(action));
    case seasonActions.SEASONS_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'filterHasSeasons', serializeFilterHasSeries(action), action.data);
    case seasonActions.SEASONS_SEARCH_ERROR:
      return searchError(state, 'filterHasSeasons', serializeFilterHasSeries(action), action.error);

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

    default:
      return state;
  }
};
