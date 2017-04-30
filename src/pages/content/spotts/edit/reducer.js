import { Map } from 'immutable';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.AUDIENCE_COUNTRIES_SEARCH_START:
      return state.set('currentAudienceCountriesSearchString', action.searchString);
    case actions.AUDIENCE_LANGUAGES_SEARCH_START:
      return state.set('currentAudienceLanguagesSearchString', action.searchString);
    case actions.BRANDS_SEARCH_START:
      return state.set('currentBrandsSearchString', action.searchString);
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    case actions.TOPICS_SEARCH_START:
      return state.set('currentTopicsSearchString', action.searchString);
    case actions.TAGS_CHARACTERS_SEARCH_START:
      return state.set('currentTagsCharactersSearchString', action.searchString);
    case actions.TAGS_PERSONS_SEARCH_START:
      return state.set('currentTagsPersonsSearchString', action.searchString);
    case actions.TAGS_PRODUCTS_SEARCH_START:
      return state.set('currentTagsProductsSearchString', action.searchString);
    case actions.USERS_SEARCH_START:
      return state.set('currentUserSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
