import { Map } from 'immutable';
import { CLOSE_POP_UP_MESSAGE } from './actions';
import { PUSH_NOTIFICATION_PERSIST_SUCCESS } from '../../../../actions/pushNotification';
export default (state = Map({}), action) => {
  switch (action.type) {
    // used by similarPushNotifications
    case PUSH_NOTIFICATION_PERSIST_SUCCESS:
      return state.set('popUpMessage', { type: 'hint', message: 'The push notification is successful saved!' });
    case CLOSE_POP_UP_MESSAGE:
      return state.set('popUpMessage', null);
    // Uninteresting actions
    default:
      return state;
  }
};
