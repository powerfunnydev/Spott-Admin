import { Map } from 'immutable';
import * as actions from './actions';
import { EPISODE_PERSIST_SUCCESS } from '../../../../actions/episode';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case actions.HELPERS_BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentHelpersBrandSearchString', action.searchString);
    case actions.HELPERS_CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentHelpersCharacterSearchString', action.searchString);
    case actions.HELPERS_SHOPS_SEARCH_START: // Autocompletion field of shops
      return state.set('currentHelpersShopSearchString', action.searchString);
    case actions.COLLECTIONS_BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentCollectionsBrandSearchString', action.searchString);
    case actions.COLLECTIONS_CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCollectionsCharacterSearchString', action.searchString);
    case actions.COLLECTIONS_PRODUCTS_SEARCH_START: // Autocompletion field of products
      return state.set('currentCollectionsProductSearchString', action.searchString);
    case actions.CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case actions.SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case actions.SERIES_ENTRY_SEASONS_SEARCH_START:
      return state.set('currentSeasonSearchString', action.searchString);
    case actions.MEDIUM_CATEGORIES_SEARCH_START: // Autocompletion field of medium categories
      return state.set('currentMediumCategoriesSearchString', action.searchString);
    case actions.SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case EPISODE_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The episode is successful saved!' });
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
