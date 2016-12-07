import { createStructuredSelector } from 'reselect';
import {
  usersEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasUsersRelationsSelector
} from '../../../../selectors/data';

export const currentUsersSearchStringSelector = (state) => state.getIn([ 'common', 'linkUserModal', 'currentUserSearchString' ]);

export const searchedUserIdsSelector = createEntityIdsByRelationSelector(searchStringHasUsersRelationsSelector, currentUsersSearchStringSelector);

export default createStructuredSelector({
  usersById: usersEntitiesSelector,
  searchedUserIds: searchedUserIdsSelector
});
