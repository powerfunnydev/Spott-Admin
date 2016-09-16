import { Map } from 'immutable';
import { SERIES_SEARCH_START } from './actions';

/**
 * -> currentSeriesSearchString
 */
export default (state = Map({}), action) => {
  switch (action.type) {

    case SERIES_SEARCH_START: // Autocompletion field of series selection
      return state.set('currentSeriesSearchString', action.searchString);

    // Uninteresting actions
    default:
      return state;

  }
};
