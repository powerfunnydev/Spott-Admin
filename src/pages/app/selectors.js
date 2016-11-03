import { createStructuredSelector } from 'reselect';
import { isAuthenticatedSelector, userRolesSelector, versionSelector } from '../../selectors/global';
import { filterQuerySelector } from '../reporting/selector';

export const headerSelector = createStructuredSelector({
  version: versionSelector
});

export const menuSelector = createStructuredSelector({
  filterQuery: filterQuerySelector,
  isAuthenticated: isAuthenticatedSelector,
  userRoles: userRolesSelector
});
