import { Map } from 'immutable';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.AUDIENCE_COUNTRIES_SEARCH_START:
      return state.set('currentAudienceCountriesSearchString', action.searchString);
    case actions.AUDIENCE_LANGUAGES_SEARCH_START:
      return state.set('currentAudienceLanguagesSearchString', action.searchString);
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    case actions.TOPICS_SEARCH_START:
      return state.set('currentTopicsSearchString', action.searchString);
    // Uninteresting actions
    default:
      return state;
  }
};
