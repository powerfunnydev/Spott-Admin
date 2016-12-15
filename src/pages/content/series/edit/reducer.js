import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE } from './actions';
import { SERIES_ENTRY_PERSIST_SUCCESS } from '../../../../actions/series';

export default (state = Map({}), action) => {
  switch (action.type) {
    case SERIES_ENTRY_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The series is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
