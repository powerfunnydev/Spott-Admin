import { createStructuredSelector } from 'reselect';
import { currentModalSelector, isAuthenticatedSelector, versionSelector } from '../../selectors/global';

export const headerSelector = createStructuredSelector({
  version: versionSelector
});

export const menuSelector = createStructuredSelector({
  isAuthenticated: isAuthenticatedSelector
});

export const appSelector = (state) => ({
  currentModal: currentModalSelector(state)
});
