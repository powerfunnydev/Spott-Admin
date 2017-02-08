import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  pushNotificationEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

const formName = 'pushNotificationEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentPushNotificationIdSelector = (state, props) => { return props.params.pushNotificationId; };
const currentPushNotificationSelector = createEntityByIdSelector(pushNotificationEntitiesSelector, currentPushNotificationIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'push-notifications', 'edit', 'popUpMessage' ]);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentPushNotification: currentPushNotificationSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  supportedLocales: supportedLocalesSelector
});
