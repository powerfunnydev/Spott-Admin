import { persistPushNotification } from '../../../../actions/pushNotification';

export const PUSH_NOTIFICATION_PERSIST_ERROR = 'PUSH_NOTIFICATION/PUSH_NOTIFICATION_PERSIST_ERROR';

export function submit ({ defaultLocale, message, url, ...restProps }) {
  return async (dispatch, getState) => {
    try {
      const pushNotification = {
        ...restProps,
        payloadData: { [defaultLocale]: message },
        payloadType: { [defaultLocale]: 'PLAIN_TEXT' },
        type: 'NOW_ON_TV',
        publishStatus: 'DRAFT',
        actionType: 'OPEN_SYNC_SCREEN',
        basedOnDefaultLocale: { [defaultLocale]: false },
        defaultLocale,
        locales: [ defaultLocale ]
      };
      return await dispatch(persistPushNotification(pushNotification));
    } catch (error) {
      dispatch({ error, type: PUSH_NOTIFICATION_PERSIST_ERROR });
    }
  };
}
