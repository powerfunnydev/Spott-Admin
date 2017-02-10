import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  pushNotificationEntitiesSelector,
  listPushNotificationDestinationsEntitiesSelector,
  searchStringHasPushNotificationDestinationsRelationsSelector,
  createEntityIdsByRelationSelector,
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
const currentPushNotificationDestinationsSearchStringSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'edit', 'currentPushNotificationDestinationsSearchString' ]);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'edit', 'popUpMessage' ]);
const searchedPushNotificationDestinationByIdsSelector = createEntityIdsByRelationSelector(
  searchStringHasPushNotificationDestinationsRelationsSelector, currentPushNotificationDestinationsSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentPushNotification: currentPushNotificationSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  pushNotificationDestinationsById: listPushNotificationDestinationsEntitiesSelector,
  searchedPushNotificationDestinationByIds: searchedPushNotificationDestinationByIdsSelector,
  supportedLocales: supportedLocalesSelector
});
