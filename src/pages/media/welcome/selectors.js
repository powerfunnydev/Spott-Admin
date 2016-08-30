import { createStructuredSelector } from 'reselect';
import { isAuthenticatedSelector } from '../../../selectors/global';

export const menuSelector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector
});
