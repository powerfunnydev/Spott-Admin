import { Map } from 'immutable';
import { MEDIUM_CATEGORIES_SEARCH_START, CHARACTERS_SEARCH_START, BROADCASTERS_SEARCH_START, CONTENT_PRODUCERS_SEARCH_START,
    SHOW_CREATE_LANGUAGE_MODAL, CLOSE_POP_UP_MESSAGE } from './actions';
import { MOVIE_PERSIST_SUCCESS } from '../../../../actions/movie';

export default (state = Map({}), action) => {
  switch (action.type) {
    case BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCharacterSearchString', action.searchString);
    case CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case MEDIUM_CATEGORIES_SEARCH_START: // Autocompletion field of medium categories
      return state.set('currentMediumCategoriesSearchString', action.searchString);
    case SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case MOVIE_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The movie is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
