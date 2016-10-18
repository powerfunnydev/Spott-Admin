import { Map } from 'immutable';
import { SEASONS_SEARCH_START, MEDIA_SEARCH_START } from './actions';

/**
 * -> currentSeasonsSearchString
 * -> currentSeriesSearchString
 */
export default (state = Map({}), action) => {
  switch (action.type) {
    case SEASONS_SEARCH_START: // Autocompletion field of seasons
      return state.set('currentSeasonsSearchString', action.searchString);
    case MEDIA_SEARCH_START: // Autocompletion field of media
      return state.set('currentMediaSearchString', action.searchString);

    // Uninteresting actions
    default:
      return state;

  }
};
