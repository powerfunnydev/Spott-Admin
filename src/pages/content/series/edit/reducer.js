import { Map } from 'immutable';
import { SERIES_ENTRY_PERSIST_SUCCESS } from '../../../../actions/series';
import * as actions from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case actions.AUDIENCE_COUNTRIES_SEARCH_START:
      return state.set('currentAudienceCountriesSearchString', action.searchString);
    case actions.AUDIENCE_LANGUAGES_SEARCH_START:
      return state.set('currentAudienceLanguagesSearchString', action.searchString);
    case SERIES_ENTRY_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The series is successful saved!' });
    case actions.CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
