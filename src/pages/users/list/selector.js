import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, usersEntitiesSelector, filterHasUsersRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasUsers } from '../../../reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'users', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'users', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'users', 'list', 'totalResultCount' ]);

export const usersFilterKeySelector = (state, props) => serializeFilterHasUsers(props.location.query);

export const usersSelector = createEntitiesByRelationSelector(
  filterHasUsersRelationsSelector,
  usersFilterKeySelector,
  usersEntitiesSelector
);

export default createStructuredSelector({
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector,
  users: usersSelector
});
