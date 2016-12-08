import { Map } from 'immutable';
import { BROADCAST_CHANNELS_SEARCH_START, CLEAR_POP_UP_MESSAGE, EPISODES_SEARCH_START,
  MEDIA_SEARCH_START, NEXT_EPISODE_FETCH_ERROR, SEASONS_SEARCH_START } from './actions';

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
    case NEXT_EPISODE_FETCH_ERROR:
      return state.set('popUpMessage', { message: 'No next episode found.', type: 'info' });
    case CLEAR_POP_UP_MESSAGE:
      return state.set('popUpMessage', {});
    // Uninteresting actions
    default:
      return state;

  }
};
