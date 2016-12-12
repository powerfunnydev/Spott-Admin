import { fromJS } from 'immutable';
import { serializeFilterHasCharacters, serializeFilterHasSeriesEntries, serializeFilterHasUsers,
    serializeFilterHasBroadcastChannels, serializeFilterHasCommercials,
    serializeFilterHasBroadcasters, serializeFilterHasTvGuideEntries, serializeFilterHasContentProducers,
    fetchStart, fetchSuccess, fetchError, searchStart, searchSuccess, searchError, fetchListStart,
    fetchListSuccess, fetchListError } from './utils';
import * as actorActions from '../actions/actor';
import * as availabilityActions from '../actions/availability';
import * as brandActions from '../actions/brand';
import * as broadcastChannelActions from '../actions/broadcastChannel';
import * as broadcastersActions from '../actions/broadcaster';
import * as charactersActions from '../actions/character';
import * as commercialActions from '../actions/commercial';
import * as contentProducersActions from '../actions/contentProducer';
import * as episodeActions from '../actions/episode';
import * as mediaActions from '../actions/media';
import * as reportingActions from '../actions/reporting';
import * as seasonActions from '../actions/season';
import * as seriesActions from '../actions/series';
import * as tvGuideActions from '../actions/tvGuide';
import * as userActions from '../actions/user';
import * as videoActions from '../actions/video';

export default (state = fromJS({
  entities: {
    actors: {},
    ages: {},
    availabilities: {},
    broadcastChannels: {},
    broadcasters: {},
    characters: {},
    contentProducers: {},
    events: {},
    genders: {},
    listBrands: {},
    listCharacters: {}, // listCharacters is the light version of characters, without locales
    listMedia: {}, // listMedia is the light version of media, without locales
    media: {}, // completed version of media, with locales
    tvGuideEntries: {},
    users: {},
    videos: {}
  },
  relations: {
    ages: {},
    broadcastChannels: {},
    events: {},
    genders: {},

    filterHasBroadcastChannels: {},
    filterHasBroadcasters: {},
    filterHasCharacters: {},
    filterHasCommercials: {},
    filterHasContentProducers: {},
    filterHasEpisodes: {},
    filterHasSeasons: {},
    filterHasSeriesEntries: {},
    filterHasTvGuideEntries: {},
    filterHasUsers: {},

    searchStringHasActors: {},
    searchStringHasBrands: {},
    searchStringHasBroadcastChannels: {},
    searchStringHasBroadcasters: {},
    searchStringHasCharacters: {},
    searchStringHasContentProducers: {},
    searchStringHasMedia: {},
    searchStringHasSeriesEntries: {},
    searchStringHasUsers: {},

    mediumHasCharacters: {},
    mediumHasTvGuideEntries: {},
    seriesEntryHasSeasons: {},
    seasonHasEpisodes: {},
    mediumHasAvailabilities: {}
  }
}), action) => {
  switch (action.type) {

    // Actors
    // //////

    case actorActions.ACTOR_SEARCH_START:
      return searchStart(state, 'searchStringHasActors', action.searchString);
    case actorActions.ACTOR_SEARCH_SUCCESS:
      return searchSuccess(state, 'actors', 'searchStringHasActors', action.searchString, action.data);
    case actorActions.ACTOR_SEARCH_ERROR:
      return searchError(state, 'searchStringHasActors', action.searchString, action.error);

    // Availabilities
    // //////////////

    case availabilityActions.AVAILABILITIES_FETCH_START:
      return searchStart(state, 'mediumHasAvailabilities', action.mediumId);
    case availabilityActions.AVAILABILITIES_FETCH_SUCCESS:
      return searchSuccess(state, 'availabilities', 'mediumHasAvailabilities', action.mediumId, action.data);
    case availabilityActions.AVAILABILITIES_FETCH_ERROR:
      return searchError(state, 'mediumHasAvailabilities', action.mediumId, action.error);

    // Brands
    // //////

    case brandActions.BRAND_SEARCH_START:
      return searchStart(state, 'searchStringHasBrands', action.searchString);
    case brandActions.BRAND_SEARCH_SUCCESS:
      return searchSuccess(state, 'listBrands', 'searchStringHasBrands', action.searchString, action.data);
    case brandActions.BRAND_SEARCH_ERROR:
      return searchError(state, 'searchStringHasBrands', action.searchString, action.error);

    // Broadcaster Channels
    // ////////////////////

    case broadcastChannelActions.BROADCAST_CHANNEL_FETCH_START:
      return fetchStart(state, [ 'entities', 'broadcastChannels', action.broadcastChannelId ]);
    case broadcastChannelActions.BROADCAST_CHANNEL_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'broadcastChannels', action.broadcastChannelId ], action.data);
    case broadcastChannelActions.BROADCAST_CHANNEL_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'broadcastChannels', action.broadcastChannelId ], action.error);

    case broadcastChannelActions.BROADCAST_CHANNELS_FETCH_START:
      return searchStart(state, 'filterHasBroadcastChannels', serializeFilterHasBroadcastChannels(action));
    case broadcastChannelActions.BROADCAST_CHANNELS_FETCH_SUCCESS:
      return searchSuccess(state, 'broadcastChannels', 'filterHasBroadcastChannels', serializeFilterHasBroadcastChannels(action), action.data.data);
    case broadcastChannelActions.BROADCAST_CHANNELS_FETCH_ERROR:
      return searchError(state, 'filterHasBroadcastChannels', serializeFilterHasBroadcastChannels(action), action.error);

    case broadcastChannelActions.BROADCAST_CHANNEL_SEARCH_START:
      return searchStart(state, 'searchStringHasBroadcastChannels', action.searchString);
    case broadcastChannelActions.BROADCAST_CHANNEL_SEARCH_SUCCESS:
      return searchSuccess(state, 'broadcastChannels', 'searchStringHasBroadcastChannels', action.searchString, action.data);
    case broadcastChannelActions.BROADCAST_CHANNEL_SEARCH_ERROR:
      return searchError(state, 'searchStringHasBroadcastChannels', action.searchString, action.error);

    // Broadcasters
    // ////////////

    case broadcastersActions.BROADCASTER_USERS_FETCH_START:
      return searchStart(state, 'filterHasUsers', serializeFilterHasUsers(action, 'broadcasters'));
    case broadcastersActions.BROADCASTER_USERS_FETCH_SUCCESS:
      return searchSuccess(state, 'users', 'filterHasUsers', serializeFilterHasUsers(action, 'broadcasters'), action.data.data);
    case broadcastersActions.BROADCASTER_USERS_FETCH_ERROR:
      return searchError(state, 'filterHasUsers', serializeFilterHasUsers(action, 'broadcasters'), action.error);

    case broadcastersActions.BROADCASTER_CHANNELS_FETCH_START:
      return fetchListStart(state, 'broadcastChannels');
    case broadcastersActions.BROADCASTER_CHANNELS_FETCH_SUCCESS:
      return fetchListSuccess(state, 'broadcastChannels', 'broadcastChannels', action.data.data);
    case broadcastersActions.BROADCASTER_CHANNELS_FETCH_ERROR:
      return fetchListError(state, 'broadcastChannels', action.error);

    case broadcastersActions.BROADCASTER_FETCH_START:
      return fetchStart(state, [ 'entities', 'broadcasters', action.broadcasterId ]);
    case broadcastersActions.BROADCASTER_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'broadcasters', action.broadcasterId ], action.data);
    case broadcastersActions.BROADCASTER_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'broadcasters', action.broadcasterId ], action.error);

    case broadcastersActions.BROADCASTERS_FETCH_START:
      return searchStart(state, 'filterHasBroadcasters', serializeFilterHasBroadcasters(action));
    case broadcastersActions.BROADCASTERS_FETCH_SUCCESS:
      return searchSuccess(state, 'broadcasters', 'filterHasBroadcasters', serializeFilterHasBroadcasters(action), action.data.data);
    case broadcastersActions.BROADCASTERS_FETCH_ERROR:
      return searchError(state, 'filterHasBroadcasters', serializeFilterHasBroadcasters(action), action.error);

    case broadcastersActions.BROADCASTER_SEARCH_START:
      return searchStart(state, 'searchStringHasBroadcasters', action.searchString);
    case broadcastersActions.BROADCASTER_SEARCH_SUCCESS:
      return searchSuccess(state, 'broadcasters', 'searchStringHasBroadcasters', action.searchString, action.data);
    case broadcastersActions.BROADCASTER_SEARCH_ERROR:
      return searchError(state, 'searchStringHasBroadcasters', action.searchString, action.error);

    // Characters
    // //////////

    case charactersActions.CHARACTER_FETCH_START:
      return fetchStart(state, [ 'entities', 'characters', action.characterId ]);
    case charactersActions.CHARACTER_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'characters', action.characterId ], action.data);
    case charactersActions.CHARACTER_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'characters', action.characterId ], action.error);

    case charactersActions.CHARACTERS_FETCH_START:
      return searchStart(state, 'filterHasCharacters', serializeFilterHasCharacters(action));
    case charactersActions.CHARACTERS_FETCH_SUCCESS:
      return searchSuccess(state, 'listCharacters', 'filterHasCharacters', serializeFilterHasCharacters(action), action.data.data);
    case charactersActions.CHARACTERS_FETCH_ERROR:
      return searchError(state, 'filterHasCharacters', serializeFilterHasCharacters(action), action.error);

    case charactersActions.CHARACTER_SEARCH_START:
      return searchStart(state, 'searchStringHasCharacters', action.searchString);
    case charactersActions.CHARACTER_SEARCH_SUCCESS:
      return searchSuccess(state, 'listCharacters', 'searchStringHasCharacters', action.searchString, action.data);
    case charactersActions.CHARACTER_SEARCH_ERROR:
      return searchError(state, 'searchStringHasCharacters', action.searchString, action.error);

    case charactersActions.MEDIUM_CHARACTER_SEARCH_START:
      return searchStart(state, 'mediumHasCharacters', action.mediumId);
    case charactersActions.MEDIUM_CHARACTER_SEARCH_SUCCESS:
      return searchSuccess(state, 'listCharacters', 'mediumHasCharacters', action.mediumId, action.data);
    case charactersActions.MEDIUM_CHARACTER_SEARCH_ERROR:
      return searchError(state, 'mediumHasCharacters', action.mediumId, action.error);

    // Commercials
    // ///////////

    case commercialActions.COMMERCIAL_FETCH_START:
      return fetchStart(state, [ 'entities', 'media', action.commercialId ]);
    case commercialActions.COMMERCIAL_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'media', action.commercialId ], action.data);
    case commercialActions.COMMERCIAL_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'media', action.commercialId ], action.error);

    case commercialActions.COMMERCIALS_FETCH_START:
      return searchStart(state, 'filterHasCommercials', serializeFilterHasCommercials(action));
    case commercialActions.COMMERCIALS_FETCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'filterHasCommercials', serializeFilterHasCommercials(action), action.data.data);
    case commercialActions.COMMERCIALS_FETCH_ERROR:
      return searchError(state, 'filterHasCommercials', serializeFilterHasCommercials(action), action.error);

    // Content producers
    // /////////////////

    case contentProducersActions.CONTENT_PRODUCER_USERS_FETCH_START:
      return searchStart(state, 'filterHasUsers', serializeFilterHasUsers(action, 'contentProducers'));
    case contentProducersActions.CONTENT_PRODUCER_USERS_FETCH_SUCCESS:
      return searchSuccess(state, 'users', 'filterHasUsers', serializeFilterHasUsers(action, 'contentProducers'), action.data.data);
    case contentProducersActions.CONTENT_PRODUCER_USERS_FETCH_ERROR:
      return searchError(state, 'filterHasUsers', serializeFilterHasUsers(action, 'contentProducers'), action.error);

    case contentProducersActions.CONTENT_PRODUCER_FETCH_START:
      return fetchStart(state, [ 'entities', 'contentProducers', action.contentProducerId ]);
    case contentProducersActions.CONTENT_PRODUCER_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'contentProducers', action.contentProducerId ], action.data);
    case contentProducersActions.CONTENT_PRODUCER_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'contentProducers', action.contentProducerId ], action.error);

    case contentProducersActions.CONTENT_PRODUCERS_FETCH_START:
      return searchStart(state, 'filterHasContentProducers', serializeFilterHasContentProducers(action));
    case contentProducersActions.CONTENT_PRODUCERS_FETCH_SUCCESS:
      return searchSuccess(state, 'contentProducers', 'filterHasContentProducers', serializeFilterHasContentProducers(action), action.data.data);
    case contentProducersActions.CONTENT_PRODUCERS_FETCH_ERROR:
      return searchError(state, 'filterHasContentProducers', serializeFilterHasContentProducers(action), action.error);

    case contentProducersActions.CONTENT_PRODUCER_SEARCH_START:
      return searchStart(state, 'searchStringHasContentProducers', action.searchString);
    case contentProducersActions.CONTENT_PRODUCER_SEARCH_SUCCESS:
      return searchSuccess(state, 'contentProducers', 'searchStringHasContentProducers', action.searchString, action.data);
    case contentProducersActions.CONTENT_PRODUCER_SEARCH_ERROR:
      return searchError(state, 'searchStringHasContentProducers', action.searchString, action.error);

    // Episodes
    // /////////////////

    case episodeActions.EPISODE_FETCH_START:
      return fetchStart(state, [ 'entities', 'media', action.episodeId ]);
    case episodeActions.EPISODE_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'media', action.episodeId ], action.data);
    case episodeActions.EPISODE_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'media', action.episodeId ], action.error);

    // Media
    // /////////////////

    case mediaActions.TV_GUIDE_ENTRIES_FETCH_START:
      return searchStart(state, 'mediumHasTvGuideEntries', serializeFilterHasTvGuideEntries(action));
    case mediaActions.TV_GUIDE_ENTRIES_FETCH_SUCCESS:
      return searchSuccess(state, 'tvGuideEntries', 'mediumHasTvGuideEntries', serializeFilterHasTvGuideEntries(action), action.data.data);
    case mediaActions.TV_GUIDE_ENTRIES_FETCH_ERROR:
      return searchError(state, 'mediumHasTvGuideEntries', serializeFilterHasTvGuideEntries(action), action.error);

    // Seasons
    // /////////////////

    case seasonActions.SEASON_FETCH_START:
      return fetchStart(state, [ 'entities', 'media', action.seasonId ]);
    case seasonActions.SEASON_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'media', action.seasonId ], action.data);
    case seasonActions.SEASON_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'media', action.seasonId ], action.error);

    case seasonActions.EPISODES_SEARCH_START:
      return searchStart(state, 'seasonHasEpisodes', action.seasonId);
    case seasonActions.EPISODES_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'seasonHasEpisodes', action.seasonId, action.data);
    case seasonActions.EPISODES_SEARCH_ERROR:
      return searchError(state, 'seasonHasEpisodes', action.seasonId, action.error);

    case seasonActions.SEASON_EPISODES_FETCH_START:
      return searchStart(state, 'seasonHasEpisodes', action.seasonId);
    case seasonActions.SEASON_EPISODES_FETCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'seasonHasEpisodes', action.seasonId, action.data.data);
    case seasonActions.SEASON_EPISODES_FETCH_ERROR:
      return searchError(state, 'seasonHasEpisodes', action.seasonId, action.error);

    // Series Entries
    // //////////////

    case seriesActions.SERIES_ENTRY_FETCH_START:
      return fetchStart(state, [ 'entities', 'media', action.seriesEntryId ]);
    case seriesActions.SERIES_ENTRY_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'media', action.seriesEntryId ], action.data);
    case seriesActions.SERIES_ENTRY_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'media', action.seriesEntryId ], action.error);

    case seriesActions.SERIES_ENTRY_SEASONS_FETCH_START:
      return searchStart(state, 'seriesEntryHasSeasons', action.seriesEntryId);
    case seriesActions.SERIES_ENTRY_SEASONS_FETCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'seriesEntryHasSeasons', action.seriesEntryId, action.data.data);
    case seriesActions.SERIES_ENTRY_SEASONS_FETCH_ERROR:
      return searchError(state, 'seriesEntryHasSeasons', action.seriesEntryId, action.error);

    case seriesActions.SERIES_ENTRIES_FETCH_START:
      return searchStart(state, 'filterHasSeriesEntries', serializeFilterHasSeriesEntries(action));
    case seriesActions.SERIES_ENTRIES_FETCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'filterHasSeriesEntries', serializeFilterHasSeriesEntries(action), action.data.data);
    case seriesActions.SERIES_ENTRIES_FETCH_ERROR:
      return searchError(state, 'filterHasSeriesEntries', serializeFilterHasSeriesEntries(action), action.error);

    case seriesActions.SERIES_ENTRIES_SEARCH_START:
      return searchStart(state, 'searchStringHasSeriesEntries', action.searchString);
    case seriesActions.SERIES_ENTRIES_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'searchStringHasSeriesEntries', action.searchString, action.data);
    case seriesActions.SERIES_ENTRIES_SEARCH_ERROR:
      return searchError(state, 'searchStringHasSeriesEntries', action.searchString, action.error);

    case seriesActions.SEASONS_SEARCH_START:
      return searchStart(state, 'seriesEntryHasSeasons', action.seriesEntryId);
    case seriesActions.SEASONS_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'seriesEntryHasSeasons', action.seriesEntryId, action.data);
    case seriesActions.SEASONS_SEARCH_ERROR:
      return searchError(state, 'seriesEntryHasSeasons', action.seriesEntryId, action.error);

    // Tv Guide
    // /////////////////

    case tvGuideActions.TV_GUIDE_ENTRIES_FETCH_START:
      return searchStart(state, 'filterHasTvGuideEntries', serializeFilterHasTvGuideEntries(action));
    case tvGuideActions.TV_GUIDE_ENTRIES_FETCH_SUCCESS:
      return searchSuccess(state, 'tvGuideEntries', 'filterHasTvGuideEntries', serializeFilterHasTvGuideEntries(action), action.data.data);
    case tvGuideActions.TV_GUIDE_ENTRIES_FETCH_ERROR:
      return searchError(state, 'filterHasTvGuideEntries', serializeFilterHasTvGuideEntries(action), action.error);

    case tvGuideActions.TV_GUIDE_ENTRY_FETCH_START:
      return fetchStart(state, [ 'entities', 'tvGuideEntries', action.tvGuideEntryId ]);
    case tvGuideActions.TV_GUIDE_ENTRY_FETCH_SUCCESS:
      let newState = fetchSuccess(state, [ 'entities', 'tvGuideEntries', action.tvGuideEntryId ], action.data);
      if (action.data.medium.type === 'TV_SERIE_EPISODE') {
        newState = fetchSuccess(newState, [ 'entities', 'listMedia', action.data.serie.id ], action.data.serie);
        newState = fetchSuccess(newState, [ 'entities', 'listMedia', action.data.season.id ], action.data.season);
      }
      return fetchSuccess(newState, [ 'entities', 'listMedia', action.data.medium.id ], action.data.medium);
    case tvGuideActions.TV_GUIDE_ENTRY_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'tvGuideEntries', action.tvGuideEntryId ], action.error);

    // Media
    // /////

    case mediaActions.MEDIA_SEARCH_START:
      return searchStart(state, 'searchStringHasMedia', action.searchString);
    case mediaActions.MEDIA_SEARCH_SUCCESS:
      return searchSuccess(state, 'listMedia', 'searchStringHasMedia', action.searchString, action.data);
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

    // Users
    // /////

    case userActions.USER_FETCH_START:
      return fetchStart(state, [ 'entities', 'users', action.userId ]);
    case userActions.USER_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'users', action.userId ], action.data);
    case userActions.USER_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'users', action.userId ], action.error);

    case userActions.USERS_FETCH_START:
      return searchStart(state, 'filterHasUsers', serializeFilterHasUsers(action));
    case userActions.USERS_FETCH_SUCCESS:
      return searchSuccess(state, 'users', 'filterHasUsers', serializeFilterHasUsers(action), action.data.data);
    case userActions.USERS_FETCH_ERROR:
      return searchError(state, 'filterHasUsers', serializeFilterHasUsers(action), action.error);

    case userActions.USER_SEARCH_START:
      return searchStart(state, 'searchStringHasUsers', action.searchString);
    case userActions.USER_SEARCH_SUCCESS:
      return searchSuccess(state, 'users', 'searchStringHasUsers', action.searchString, action.data);
    case userActions.USER_SEARCH_ERROR:
      return searchError(state, 'searchStringHasUsers', action.searchString, action.error);

    // Videos
    // //////

    case videoActions.VIDEO_FETCH_START:
      return fetchStart(state, [ 'entities', 'videos', action.videoId ]);
    case videoActions.VIDEO_FETCH_SUCCESS:
      return fetchSuccess(state, [ 'entities', 'videos', action.videoId ], action.data);
    case videoActions.VIDEO_FETCH_ERROR:
      return fetchError(state, [ 'entities', 'videos', action.videoId ], action.error);

    default:
      return state;
  }
};
