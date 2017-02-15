import { Map } from 'immutable';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.BROADCASTER_CHANNELS_SEARCH_START: // Autocompletion field of broadcast channels
      return state.set('currentBroadcasterChannelsSearchString', action.searchString);
    case actions.BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case actions.BROADCASTER_MEDIA_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcasterMediaSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
