import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listPushNotificationsEntitiesSelector, filterHasPushNotificationsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasPushNotifications } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'pushNotifications', 'list', 'totalResultCount' ]);

export const pushNotificationsFilterKeySelector = (state, props) => { return serializeFilterHasPushNotifications(props.location.query); };

export const pushNotificationsSelector = createEntitiesByRelationSelector(
  filterHasPushNotificationsRelationsSelector,
  pushNotificationsFilterKeySelector,
  listPushNotificationsEntitiesSelector
);

export default createStructuredSelector({
  pushNotifications: pushNotificationsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
