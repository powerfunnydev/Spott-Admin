import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE } from './actions';
import { PERSON_PERSIST_SUCCESS } from '../../../../actions/person';

export default (state = Map({}), action) => {
  switch (action.type) {
    case PERSON_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The person is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
