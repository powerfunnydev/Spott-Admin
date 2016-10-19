import { Map } from 'immutable';
import { BROADCAST_CHANNELS_SEARCH_START, EPISODES_SEARCH_START, SEASONS_SEARCH_START, MEDIA_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BROADCAST_CHANNELS_SEARCH_START: // Autocompletion field of broadcast channel
      return state.set('currentBroadcastChannelsSearchString', action.searchString);
    case EPISODES_SEARCH_START: // Autocompletion field of episodes
      return state.set('currentEpisodesSearchString', action.searchString);
    case SEASONS_SEARCH_START: // Autocompletion field of seasons
      return state.set('currentSeasonsSearchString', action.searchString);
    case MEDIA_SEARCH_START: // Autocompletion field of media
      return state.set('currentMediaSearchString', action.searchString);

    // Uninteresting actions
    default:
      return state;

  }
};
