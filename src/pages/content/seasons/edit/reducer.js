import { Map } from 'immutable';
import { SHOW_CREATE_LANGUAGE_MODAL,
  SERIES_ENTRIES_SEARCH_START } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    // Uninteresting actions
    default:
      return state;
  }
};
