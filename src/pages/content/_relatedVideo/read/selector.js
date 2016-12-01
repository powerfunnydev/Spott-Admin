import { createSelector, createStructuredSelector } from 'reselect';
import { createEntityByIdSelector, videosEntitiesSelector } from '../../../../selectors/data';
import { videoHasProgressSelector } from '../persist/selector';

const videoIdSelector = (state, props) => props.input.value;
const videoSelector = createEntityByIdSelector(videosEntitiesSelector, videoIdSelector);

const externalReferenceSelector = (state, props) => props.medium.get('externalReference');

const videoUploadStatusSelector = createSelector(
  videoHasProgressSelector,
  externalReferenceSelector,
  (videoHasProgress, externalReference) => videoHasProgress.get(externalReference)
);

export default createStructuredSelector({
  video: videoSelector,
  videoUploadStatus: videoUploadStatusSelector
});
