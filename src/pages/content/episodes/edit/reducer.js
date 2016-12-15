import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, CHARACTERS_SEARCH_START, BROADCASTERS_SEARCH_START, CONTENT_PRODUCERS_SEARCH_START, MEDIUM_CATEGORIES_SEARCH_START,
  SHOW_CREATE_LANGUAGE_MODAL, SERIES_ENTRIES_SEARCH_START, SERIES_ENTRY_SEASONS_SEARCH_START } from './actions';
import { EPISODE_PERSIST_SUCCESS } from '../../../../actions/episode';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCharacterSearchString', action.searchString);
    case CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case SERIES_ENTRY_SEASONS_SEARCH_START:
      return state.set('currentSeasonSearchString', action.searchString);
    case MEDIUM_CATEGORIES_SEARCH_START: // Autocompletion field of medium categories
      return state.set('currentMediumCategoriesSearchString', action.searchString);
    case SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case EPISODE_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The episode is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
