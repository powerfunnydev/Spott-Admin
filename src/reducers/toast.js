import { Map, List } from 'immutable';
import * as toastActions from '../actions/toast';
import * as userActions from '../actions/user';
import * as contentProducerActions from '../actions/contentProducer';
import * as broadcasterActions from '../actions/broadcaster';
import * as broadcastChannelActions from '../actions/broadcastChannel';
import * as episodeActions from '../actions/episode';
import * as seasonActions from '../actions/season';
import * as seriesActions from '../actions/series';
import * as tvGuideActions from '../actions/tvGuide';

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
      return pushError(state, action.error, 'broadcastChannel');
    case broadcasterActions.BROADCASTER_PERSIST_ERROR:
      return pushError(state, action.error, 'broadcaster');
    case contentProducerActions.CONTENT_PRODUCER_DELETE_ERROR:
    case contentProducerActions.CONTENT_PRODUCERS_DELETE_ERROR:
    case contentProducerActions.CONTENT_PRODUCER_PERSIST_ERROR:
      return pushError(state, action.error, 'contentProducer');
    case episodeActions.EPISODE_DELETE_ERROR:
    case episodeActions.EPISODES_DELETE_ERROR:
    case episodeActions.EPISODE_PERSIST_ERROR:
      return pushError(state, action.error, 'episode');
    case seasonActions.SEASON_DELETE_ERROR:
    case seasonActions.SEASONS_DELETE_ERROR:
    case seasonActions.SEASON_PERSIST_ERROR:
      return pushError(state, action.error, 'season');
    case seriesActions.SERIES_ENTRY_DELETE_ERROR:
    case seriesActions.SERIES_ENTRIES_DELETE_ERROR:
    case seriesActions.SERIES_ENTRY_PERSIST_ERROR:
      return pushError(state, action.error, 'seriesEntry');
    case userActions.USERS_DELETE_ERROR:
    case userActions.USER_DELETE_ERROR:
    case userActions.USER_PERSIST_ERROR:
      return pushError(state, action.error, 'user');

    // Success messages
    case broadcastChannelActions.BROADCAST_CHANNEL_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'broadcastChannel');
    case broadcasterActions.BROADCASTER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'broadcaster');
    case userActions.USER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'user');
    case contentProducerActions.CONTENT_PRODUCER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'contentProducer');
    case episodeActions.EPISODE_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'episode');
    case seasonActions.SEASON_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'season');
    case seriesActions.SERIES_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'seriesEntry');
    case tvGuideActions.TV_GUIDE_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, 'tvGuideEntry');
    case toastActions.TOAST_POP:
      return pop(state);
    default:
      return state;
  }
};
