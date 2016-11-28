import { Map } from 'immutable';
import { BROADCASTERS_SEARCH_START, CONTENT_PRODUCERS_SEARCH_START, SHOW_CREATE_LANGUAGE_MODAL,
  SERIES_ENTRIES_SEARCH_START, SERIES_ENTRY_SEASONS_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case SERIES_ENTRY_SEASONS_SEARCH_START:
      return state.set('currentSeasonSearchString', action.searchString);
    case SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    // Uninteresting actions
    default:
      return state;
  }
};
