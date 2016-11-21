import { Map } from 'immutable';
import { SERIES_ENTRIES_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case SERIES_ENTRIES_SEARCH_START: // Autocompletion field of broadcast channel
      return state.set('currentSeriesEntrySearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;

  }
};
