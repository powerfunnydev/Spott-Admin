import {
  createMediaJobNameSelector, createMediaProgressSelector,
  createMediaRemainingTimeSelector, createMediaStatusSelector,
  currentCreateMediaMediaTypeSelector, currentCreateMediaTabSelector
} from './common';

export default (state) => ({
  currentMediaType: currentCreateMediaMediaTypeSelector(state),
  currentTab: currentCreateMediaTabSelector(state),
  jobName: createMediaJobNameSelector(state),
  progress: createMediaProgressSelector(state),
  remainingTime: createMediaRemainingTimeSelector(state),
  status: createMediaStatusSelector(state)
});
