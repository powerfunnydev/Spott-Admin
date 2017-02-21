import { createStructuredSelector } from 'reselect';
import {
  pushNotificationEntitiesSelector,
  // mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

const currentPushNotificationIdSelector = (state, props) => { return props.params.pushNotificationId; };

export const currentPushNotificationSelector = createEntityByIdSelector(pushNotificationEntitiesSelector, currentPushNotificationIdSelector);

export default createStructuredSelector({
  currentPushNotification: currentPushNotificationSelector
});
