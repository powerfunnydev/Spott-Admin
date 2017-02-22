import { Map } from 'immutable';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.AUDIENCE_COUNTRIES_SEARCH_START:
      return state.set('currentAudienceCountriesSearchString', action.searchString);
    case actions.AUDIENCE_LANGUAGES_SEARCH_START:
      return state.set('currentAudienceLanguagesSearchString', action.searchString);
    case actions.BANNER_LINK_BRANDS_SEARCH_START: // Autocompletion field of brand selection
      return state.set('currentBannerLinkBrandsSearchString', action.searchString);
    case actions.BANNER_LINK_CHARACTERS_SEARCH_START: // Autocompletion field of character selection
      return state.set('currentBannerLinkCharactersSearchString', action.searchString);
    case actions.BANNER_LINK_MEDIA_SEARCH_START: // Autocompletion field of medium selection
      return state.set('currentBannerLinkMediaSearchString', action.searchString);
    case actions.BANNER_LINK_PERSONS_SEARCH_START: // Autocompletion field of actor selection
      return state.set('currentBannerLinkPersonsSearchString', action.searchString);
    case actions.COLLECTIONS_BRANDS_SEARCH_START: // Autocompletion field of brands
      return state.set('currentCollectionsBrandSearchString', action.searchString);
    case actions.COLLECTIONS_CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCollectionsCharacterSearchString', action.searchString);
    case actions.COLLECTIONS_PRODUCTS_SEARCH_START: // Autocompletion field of products
      return state.set('currentCollectionsProductSearchString', action.searchString);
    case actions.BROADCASTERS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentBroadcastersSearchString', action.searchString);
    case actions.BRANDS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentBrandsSearchString', action.searchString);
    case actions.CHARACTERS_SEARCH_START: // Autocompletion field of characters
      return state.set('currentCharacterSearchString', action.searchString);
    case actions.CONTENT_PRODUCERS_SEARCH_START: // Autocompletion field of content producers
      return state.set('currentContentProducersSearchString', action.searchString);
    case actions.SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    // Uninteresting actions
    default:
      return state;
  }
};
