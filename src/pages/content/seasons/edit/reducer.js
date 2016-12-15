import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, SHOW_CREATE_LANGUAGE_MODAL, SERIES_ENTRIES_SEARCH_START } from './actions';
import { SEASON_PERSIST_SUCCESS } from '../../../../actions/season';

export default (state = Map({}), action) => {
  switch (action.type) {
    case SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case SEASON_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The season is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
