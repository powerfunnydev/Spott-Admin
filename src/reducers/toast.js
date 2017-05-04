import { Map, List } from 'immutable';
import * as brandActions from '../actions/brand';
import * as broadcastChannelActions from '../actions/broadcastChannel';
import * as broadcasterActions from '../actions/broadcaster';
import * as characterActions from '../actions/character';
import * as commercialActions from '../actions/commercial';
import * as contentProducerActions from '../actions/contentProducer';
import * as entityTypes from '../constants/entityTypes';
import * as episodeActions from '../actions/episode';
import * as movieActions from '../actions/movie';
import * as personActions from '../actions/person';
import * as productActions from '../actions/product';
import * as pushNotificationActions from '../actions/pushNotification';
import * as seasonActions from '../actions/season';
import * as seriesActions from '../actions/series';
import * as shopActions from '../actions/shop';
import * as spottActions from '../actions/spott';
import * as toastActions from '../actions/toast';
import * as topicActions from '../actions/topic';
import * as tvGuideActions from '../actions/tvGuide';
import * as userActions from '../actions/user';
import * as scheduleEntryActions from '../actions/scheduleEntry';

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
    case brandActions.BRAND_DELETE_ERROR:
    case brandActions.BRANDS_DELETE_ERROR:
    case brandActions.BRAND_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.BRAND);

    case broadcastChannelActions.BROADCAST_CHANNEL_DELETE_ERROR:
    case broadcastChannelActions.BROADCAST_CHANNELS_DELETE_ERROR:
    case broadcastChannelActions.BROADCAST_CHANNEL_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.BROADCAST_CHANNEL);

    case broadcasterActions.BROADCASTER_DELETE_ERROR:
    case broadcasterActions.BROADCASTERS_DELETE_ERROR:
    case broadcasterActions.BROADCASTER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.BROADCASTER);

    case characterActions.CHARACTER_DELETE_ERROR:
    case characterActions.CHARACTERS_DELETE_ERROR:
    case characterActions.CHARACTER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.CHARACTER);

    case commercialActions.COMMERCIAL_DELETE_ERROR:
    case commercialActions.COMMERCIALS_DELETE_ERROR:
    case commercialActions.COMMERCIAL_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.COMMERCIAL);

    case contentProducerActions.CONTENT_PRODUCER_DELETE_ERROR:
    case contentProducerActions.CONTENT_PRODUCERS_DELETE_ERROR:
    case contentProducerActions.CONTENT_PRODUCER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.CONTENT_PRODUCER);

    case episodeActions.EPISODE_DELETE_ERROR:
    case episodeActions.EPISODES_DELETE_ERROR:
    case episodeActions.EPISODE_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.EPISODE);

    case movieActions.MOVIE_DELETE_ERROR:
    case movieActions.MOVIES_DELETE_ERROR:
    case movieActions.MOVIE_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.MOVIE);

    case personActions.PERSON_DELETE_ERROR:
    case personActions.PERSONS_DELETE_ERROR:
    case personActions.PERSON_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.PERSON);

    case productActions.PRODUCT_DELETE_ERROR:
    case productActions.PRODUCTS_DELETE_ERROR:
    case productActions.PRODUCT_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.PRODUCT);

    case pushNotificationActions.PUSH_NOTIFICATION_DELETE_ERROR:
    case pushNotificationActions.PUSH_NOTIFICATIONS_DELETE_ERROR:
    case pushNotificationActions.PUSH_NOTIFICATION_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.PUSH_NOTIFICATION);

    case seasonActions.SEASON_DELETE_ERROR:
    case seasonActions.SEASONS_DELETE_ERROR:
    case seasonActions.SEASON_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SEASON);

    case seriesActions.SERIES_ENTRY_DELETE_ERROR:
    case seriesActions.SERIES_ENTRIES_DELETE_ERROR:
    case seriesActions.SERIES_ENTRY_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SERIES_ENTRY);

    case shopActions.SHOP_DELETE_ERROR:
    case shopActions.SHOPS_DELETE_ERROR:
    case shopActions.SHOP_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SHOP);

    case topicActions.TOPIC_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.TOPIC);

    case tvGuideActions.TV_GUIDE_ENTRIES_DELETE_ERROR:
    case tvGuideActions.TV_GUIDE_ENTRY_DELETE_ERROR:
    case tvGuideActions.TV_GUIDE_ENTRY_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.TV_GUIDE_ENTRY);

    case scheduleEntryActions.SCHEDULE_ENTRY_DELETE_ERROR:
    case scheduleEntryActions.SCHEDULE_ENTRY_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SCHEDULE_ENTRY);

    case spottActions.SPOTT_DELETE_ERROR:
    case spottActions.SPOTTS_DELETE_ERROR:
    case spottActions.SPOTT_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.SPOTT);

    case userActions.USERS_DELETE_ERROR:
    case userActions.USER_DELETE_ERROR:
    case userActions.USER_PERSIST_ERROR:
      return pushError(state, action.error, entityTypes.USER);

    // Success messages

    case brandActions.BRAND_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.BRAND);

    case broadcastChannelActions.BROADCAST_CHANNEL_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.BROADCAST_CHANNEL);

    case broadcasterActions.BROADCASTER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.BROADCASTER);

    case characterActions.CHARACTER_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.CHARACTER);

    case commercialActions.COMMERCIAL_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.COMMERCIAL);

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

    case productActions.PRODUCT_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.PRODUCT);

    case pushNotificationActions.PUSH_NOTIFICATION_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.PUSH_NOTIFICATION);

    case seasonActions.SEASON_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SEASON);

    case seriesActions.SERIES_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SERIES_ENTRY);

    case shopActions.SHOP_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SHOP);

    case spottActions.SPOTT_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SPOTT);

    case topicActions.TOPIC_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.TOPIC);

    case tvGuideActions.TV_GUIDE_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.TV_GUIDE_ENTRY);

    case scheduleEntryActions.SCHEDULE_ENTRY_PERSIST_SUCCESS:
      return pushSuccess(state, action.data, entityTypes.SCHEDULE_ENTRY);
    // SCHEDULE_ENTRY_DELETE_ERROR
    // SCHEDULE_ENTRIES_DELETE_ERROR

    case toastActions.TOAST_POP:
      return pop(state);
    default:
      return state;
  }
};
