import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE, SET_POP_UP_MESSAGE } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    case SET_POP_UP_MESSAGE:
      return state.set('popUpMessage', action.popUpMessage);
    default:
      return state;
  }
};
