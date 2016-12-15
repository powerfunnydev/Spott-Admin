import { Map, List } from 'immutable';
import * as toastActions from '../actions/toast';
import * as userActions from '../actions/user';
import * as contentProducerActions from '../actions/contentProducer';
import * as broadcasterActions from '../actions/broadcaster';
import * as broadcastChannelActions from '../actions/broadcastChannel';
import * as characterActions from '../actions/character';
import * as episodeActions from '../actions/episode';
import * as movieActions from '../actions/movie';
import * as personActions from '../actions/person';
import * as seasonActions from '../actions/season';
import * as seriesActions from '../actions/series';
import * as tvGuideActions from '../actions/tvGuide';
import * as entityTypes from '../constants/entityTypes';

function pushError (state, error, entityType) {
  return state.push(Map({ type: 'error', error, entityType }));
}

// function pushInfo (state, entity, entityType) {
//   return state.push(Map({ type: 'info', entity, entityType }));
// }

// function pushWarning (state, entity, entityType) {
//   return state.push(Map({ type: 'warning', entity, entityType }));
// }

function pushSuccess (state, entity, entityType) {
  return state.push(Map({ type: 'success', entity, entityType }));
}

function pop (state) {
  return state.shift();
}

export default (state = List(), action) => {
  switch (action.type) {
    // Error messages
    case broadcastChannelActions.BROADCAST_CHANNEL_DELETE_ERROR:
    case broadcastChannelActions.BROADCAST_CHANNELS_DELETE_ERROR:
    case broadcastChannelActions.BROADCAST_CHANNEL_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.BROADCAST_CHANNEL);
    case broadcasterActions.BROADCASTER_DELETE_ERROR:
    case broadcasterActions.BROADCASTERS_DELETE_ERROR:
    case broadcasterActions.BROADCASTER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.BROADCASTER);
    case contentProducerActions.CONTENT_PRODUCER_DELETE_ERROR:
    case contentProducerActions.CONTENT_PRODUCERS_DELETE_ERROR:
    case contentProducerActions.CONTENT_PRODUCER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.CONTENT_PRODUCER);
    case episodeActions.EPISODE_DELETE_ERROR:
    case episodeActions.EPISODES_DELETE_ERROR:
    case episodeActions.EPISODE_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.EPISODE);
    case seasonActions.SEASON_DELETE_ERROR:
    case seasonActions.SEASONS_DELETE_ERROR:
    case seasonActions.SEASON_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SEASON);
    case seriesActions.SERIES_ENTRY_DELETE_ERROR:
    case seriesActions.SERIES_ENTRIES_DELETE_ERROR:
    case seriesActions.SERIES_ENTRY_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SERIES_ENTRY);
    case userActions.USERS_DELETE_ERROR:
    case userActions.USER_DELETE_ERROR:
    case userActions.USER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.USER);

    // Success messages
    case broadcastChannelActions.BROADCAST_CHANNEL_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.BROADCAST_CHANNEL);
    case broadcasterActions.BROADCASTER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.BROADCASTER);
    case characterActions.CHARACTER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.CHARACTER);
    case userActions.USER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.USER);
    case contentProducerActions.CONTENT_PRODUCER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.CONTENT_PRODUCER);
    case episodeActions.EPISODE_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.EPISODE);
    case movieActions.MOVIE_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.MOVIE);
    case personActions.PERSON_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.PERSON);
    case seasonActions.SEASON_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SEASON);
    case seriesActions.SERIES_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SERIES_ENTRY);
    case tvGuideActions.TV_GUIDE_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.TV_GUIDE_ENTRY);
    case toastActions.TOAST_POP:
      return pop(state);
    default:
      return state;
  }
};
