import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, usersEntitiesSelector, filterHasUsersRelationsSelector } from '../../../../../../selectors/data';
import { serializeFilterHasUsers } from '../../../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../../../_common/components/table/index';
import { prefix } from './index';

const isSelectedSelector = (state) => state.getIn([ 'content', 'brands', 'read', 'users', 'isSelected' ]);
const pageCountSelector = (state) => state.getIn([ 'content', 'brands', 'read', 'users', 'pageCount' ]);
const totalResultCountSelector = (state) => state.getIn([ 'content', 'brands', 'read', 'users', 'totalResultCount' ]);

// second argument of serializeFilterHasUsers is a unique key, specific for this table.
// general users <-> users of brand
const usersFilterKeySelector = (state, props) => serializeFilterHasUsers(getInformationFromQuery(props.location.query, prefix), 'brands');

export const usersSelector = createEntitiesByRelationSelector(
  filterHasUsersRelationsSelector,
  usersFilterKeySelector,
  usersEntitiesSelector
);

export default createStructuredSelector({
  usersFilterKeySelector,
  users: usersSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
