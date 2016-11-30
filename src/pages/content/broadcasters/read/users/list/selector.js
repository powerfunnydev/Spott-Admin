import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, usersEntitiesSelector, filterHasUsersRelationsSelector } from '../../../../../../selectors/data';
import { serializeFilterHasUsers } from '../../../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';

const isSelectedSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'users', 'isSelected' ]);
const pageCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'users', 'pageCount' ]);
const totalResultCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'read', 'users', 'totalResultCount' ]);

// second argument of serializeFilterHasUsers is a unique key, specific for this table.
// general users <-> users of broadcaster
const usersFilterKeySelector = (state, props) => serializeFilterHasUsers(getInformationFromQuery(props.location.query, prefix), 'broadcasters');

export const usersSelector = createEntitiesByRelationSelector(
  filterHasUsersRelationsSelector,
  usersFilterKeySelector,
  usersEntitiesSelector
);

export default createStructuredSelector({
  users: usersSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
