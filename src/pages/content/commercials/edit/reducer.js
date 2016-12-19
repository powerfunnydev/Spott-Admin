import { Map } from 'immutable';
import {
  BRANDS_SEARCH_START, BROADCASTERS_SEARCH_START, CHARACTERS_SEARCH_START,
  CONTENT_PRODUCERS_SEARCH_START, SHOW_CREATE_LANGUAGE_MODAL
} from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case BRANDS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentBrandsSearchString', action.searchString);
    case CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCharacterSearchString', action.searchString);
    case CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    // Uninteresting actions
    default:
      return state;
  }
};
