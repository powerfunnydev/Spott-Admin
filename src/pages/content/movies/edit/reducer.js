import { Map } from 'immutable';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.AUDIENCE_COUNTRIES_SEARCH_START:
      return state.set('currentAudienceCountriesSearchString', action.searchString);
    case actions.AUDIENCE_LANGUAGES_SEARCH_START:
      return state.set('currentAudienceLanguagesSearchString', action.searchString);
    case actions.BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case actions.HELPERS_BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentHelpersBrandsSearchString', action.searchString);
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
    case actions.MEDIUM_CATEGORIES_SEARCH_START: // Autocompletion field of medium categories
      return state.set('currentMediumCategoriesSearchString', action.searchString);
    case actions.SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
