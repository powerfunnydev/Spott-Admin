import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE } from './actions';
export default (state = Map({}), action) => {
  switch (action.type) {
    // used by similarPushNotifications
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
