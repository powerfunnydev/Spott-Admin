import { fetchPushNotifications as dataFetchPushNotifications,
  deletePushNotification as deletePushNotificationAction,
  deletePushNotifications as deletePushNotificationsAction } from '../../../../actions/pushNotification';

// Action types
// ////////////

export const PUSH_NOTIFICATIONS_FETCH_START = 'SERIES/PUSH_NOTIFICATIONS_FETCH_START';
export const PUSH_NOTIFICATIONS_FETCH_ERROR = 'SERIES/PUSH_NOTIFICATIONS_FETCH_ERROR';

export const PUSH_NOTIFICATIONS_DELETE_ERROR = 'SERIES/PUSH_NOTIFICATIONS_REMOVE_ERROR';
export const PUSH_NOTIFICATION_DELETE_ERROR = 'SERIES/PUSH_NOTIFICATION_REMOVE_ERROR';

export const SELECT_ALL_CHECKBOXES = 'SERIES/SELECT_ALL_CHECKBOXES';
export const SELECT_CHECKBOX = 'SERIES/SELECT_CHECKBOX';

export const SORT_COLUMN = 'SERIES/SORT_COLUMN';

export function load (query) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchPushNotifications(query));
    } catch (error) {
      dispatch({ error, type: PUSH_NOTIFICATIONS_FETCH_ERROR });
    }
  };
}

export function deletePushNotifications (pushNotificationIds) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(deletePushNotificationsAction({ pushNotificationIds }));
    } catch (error) {
      dispatch({ error, type: PUSH_NOTIFICATIONS_DELETE_ERROR });
    }
  };
}

export function deletePushNotification (pushNotificationId, type) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(deletePushNotificationAction({ pushNotificationId }));
    } catch (error) {
      dispatch({ error, type: PUSH_NOTIFICATION_DELETE_ERROR });
    }
  };
}

export function selectAllCheckboxes () {
  return { type: SELECT_ALL_CHECKBOXES };
}

export function selectCheckbox (id) {
  return { type: SELECT_CHECKBOX, id };
}
