import { Map } from 'immutable';
import { EPISODES_SEARCH_START, SEASONS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case EPISODES_SEARCH_START: // Autocompletion field of episodes
      return state.set('currentEpisodesSearchString', action.searchString);
    case SEASONS_SEARCH_START: // Autocompletion field of seasons
      return state.set('currentSeasonsSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;

  }
};
