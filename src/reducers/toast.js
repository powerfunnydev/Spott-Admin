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

function pushError (state, entity, entityType) {
  return state.push(Map({ type: 'error', entity, entityType }));
}

function pushInfo (state, entity, entityType) {
  return state.push(Map({ type: 'info', entity, entityType }));
}

function pushWarning (state, entity, entityType) {
  return state.push(Map({ type: 'warning', entity, entityType }));
}

function pushSuccess (state, entity, entityType) {
  return state.push(Map({ type: 'success', entity, entityType }));
}

function pop (state) {
  return state.shift();
}

export default (state = List(), action) => {
  switch (action.type) {
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
