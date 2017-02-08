import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listPushNotificationsEntitiesSelector, filterHasPushNotificationsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasPushNotifications } from '../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { filterArray, prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'list', 'totalResultCount' ]);

export const pushNotificationsFilterKeySelector = (state, props) => serializeFilterHasPushNotifications(getInformationFromQuery(props.location.query, prefix, filterArray));

export const pushNotificationsSelector = createEntitiesByRelationSelector(
  filterHasPushNotificationsRelationsSelector,
  pushNotificationsFilterKeySelector,
  listPushNotificationsEntitiesSelector
);

export default createStructuredSelector({
  pushNotificationFilterKey: pushNotificationsFilterKeySelector,
  pushNotifications: pushNotificationsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
