import { fetchPushNotification as dataFetchPushNotification } from '../../../../actions/pushNotification';

export const FETCH_PUSH_NOTIFICATION_ERROR = 'PUSH_NOTIFICATION_READ/FETCH_PUSH_NOTIFICATION_ERROR';

export function loadPushNotification (pushNotificationId) {
  return async (dispatch, getState) => {
    try {
      return await dispatch(dataFetchPushNotification({ pushNotificationId }));
    } catch (error) {
      dispatch({ error, type: FETCH_PUSH_NOTIFICATION_ERROR });
    }
  };
}
