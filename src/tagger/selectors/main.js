import { createStructuredSelector } from 'reselect';
import { activeTabSelector } from './global';

export const mainSelector = createStructuredSelector({
  activeTab: activeTabSelector
});
