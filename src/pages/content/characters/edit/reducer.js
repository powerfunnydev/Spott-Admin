import { Map } from 'immutable';
import { PERSONS_SEARCH_START, CLOSE_POP_UP_MESSAGE } from './actions';
import { CHARACTER_PERSIST_SUCCESS } from '../../../../actions/character';

export default (state = Map({}), action) => {
  switch (action.type) {
    case PERSONS_SEARCH_START: // Autocompletion field of broadcasters
      return state.set('currentPersonSearchString', action.searchString);
    case CHARACTER_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The character is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
