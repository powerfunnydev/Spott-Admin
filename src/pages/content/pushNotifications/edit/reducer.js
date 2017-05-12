import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, SERIES_ENTRIES_SEARCH_START } from './actions';
export default (state = Map({}), action) => {
  switch (action.type) {
    // used by similarPushNotifications
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    case SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
