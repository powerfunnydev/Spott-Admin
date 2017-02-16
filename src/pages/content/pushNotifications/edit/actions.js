import { persistPushNotification, fetchPushNotification as dataFetchPushNotification } from '../../../../actions/pushNotification';
import { searchPushNotificationDestinations as dataSearchPushNotificationDestinations } from '../../../../actions/pushNotificationDestination';

export const PUSH_NOTIFICATION_FETCH_ENTRY_ERROR = 'PUSH_NOTIFICATION_EDIT/FETCH_ENTRY_ERROR';
export const CLOSE_POP_UP_MESSAGE = 'PUSH_NOTIFICATION_EDIT/CLOSE_POP_UP_MESSAGE';

export const PUSH_NOTIFICATION_PERSIST_ERROR = 'PUSH_NOTIFICATION_EDIT/PUSH_NOTIFICATION_PERSIST_ERROR';

export const PUSH_NOTIFICATION_DESTINATIONS_SEARCH_START = 'PUSH_NOTIFICATION_EDIT/PUSH_NOTIFICATION_DESTINATIONS_SEARCH_START';
export const PUSH_NOTIFICATION_DESTINATIONS_SEARCH_ERROR = 'PUSH_NOTIFICATION_EDIT/PUSH_NOTIFICATION_DESTINATIONS_SEARCH_ERROR';

export { openModal, closeModal } from '../../../../actions/global';

export const submit = persistPushNotification;

export function closePopUpMessage () {
  return { type: CLOSE_POP_UP_MESSAGE };
}

export function loadPushNotification (pushNotificationId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchPushNotification({ pushNotificationId }));
    } catch (error) {
      dispatch({ error, type: PUSH_NOTIFICATION_FETCH_ENTRY_ERROR });
    }
  };
}

export function searchPushNotificationDestinations () {
  return async (dispatch, getState) => {
    try {
      await dispatch({ type: PUSH_NOTIFICATION_DESTINATIONS_SEARCH_START });
      return await dispatch(dataSearchPushNotificationDestinations({}));
    } catch (error) {
      dispatch({ error, type: PUSH_NOTIFICATION_DESTINATIONS_SEARCH_ERROR });
    }
  };
}
