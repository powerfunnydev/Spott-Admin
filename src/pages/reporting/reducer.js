import { Map } from 'immutable';
import { MEDIA_SEARCH_START } from './actions';

/**
 * -> currentSeriesSearchString
 */
export default (state = Map({}), action) => {
  switch (action.type) {

    case MEDIA_SEARCH_START: // Autocompletion field of series selection
      return state.set('currentMediaSearchString', action.searchString);

    // Uninteresting actions
    default:
      return state;

  }
};
