import { Map } from 'immutable';
import { MOVIE_PERSIST_SUCCESS } from '../../../../actions/movie';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentBrandsSearchString', action.searchString);
    case actions.BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case actions.CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCharacterSearchString', action.searchString);
    case actions.SHOPS_SEARCH_START: // Autocompletion field of shops
      return state.set('currentShopSearchString', action.searchString);
    case actions.CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case actions.MEDIUM_CATEGORIES_SEARCH_START: // Autocompletion field of medium categories
      return state.set('currentMediumCategoriesSearchString', action.searchString);
    case actions.SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case MOVIE_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The movie is successful saved!' });
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
