import { createStructuredSelector } from 'reselect';
import { isAuthenticatedSelector, userRolesSelector, versionSelector } from '../../selectors/global';

export const headerSelector = createStructuredSelector({
  version: versionSelector
});

export const menuSelector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector,
  userRoles: userRolesSelector
});
