import { Map } from 'immutable';
import { BRANDS_SEARCH_START, SERIES_ENTRIES_SEARCH_START, SERIES_ENTRY_SEASONS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BRANDS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentBrandsSearchString', action.searchString);
    case SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case SERIES_ENTRY_SEASONS_SEARCH_START:
      return state.set('currentSeasonSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
