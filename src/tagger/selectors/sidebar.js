import { currentTabNameSelector } from './common';

export default (state) => ({
  currentTabName: currentTabNameSelector(state)
});
