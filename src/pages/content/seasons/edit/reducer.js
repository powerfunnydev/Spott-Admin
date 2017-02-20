import { Map } from 'immutable';
import * as actions from './actions';
import { SEASON_PERSIST_SUCCESS } from '../../../../actions/season';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.AUDIENCE_COUNTRIES_SEARCH_START:
      return state.set('currentAudienceCountriesSearchString', action.searchString);
    case actions.AUDIENCE_LANGUAGES_SEARCH_START:
      return state.set('currentAudienceLanguagesSearchString', action.searchString);
    case actions.SERIES_ENTRIES_SEARCH_START:
      return state.set('currentSeriesEntrySearchString', action.searchString);
    case actions.SHOW_CREATE_LANGUAGE_MODAL:
      return state.set('showCreateLanguageModal', true);
    case SEASON_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The season is successful saved!' });
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
