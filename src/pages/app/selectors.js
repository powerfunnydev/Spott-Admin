import { createStructuredSelector } from 'reselect';
import { locationSelector, isAuthenticatedSelector, userRolesSelector, versionSelector } from '../../selectors/global';

const filterQuerySelector = (state) => state.getIn([ 'reporting', 'filterQuery' ]);

export const headerSelector = createStructuredSelector({
  version: versionSelector
});

export const menuSelector = createStructuredSelector({
  location: locationSelector,
  filterQuery: filterQuerySelector,
  isAuthenticated: isAuthenticatedSelector,
  userRoles: userRolesSelector
});
