import { createStructuredSelector } from 'reselect';
import { createEntityByIdSelector, videosEntitiesSelector } from '../../../../selectors/data';

const videoIdSelector = (state, props) => props.input.value;
const videoSelector = createEntityByIdSelector(videosEntitiesSelector, videoIdSelector);

export default createStructuredSelector({
  video: videoSelector
});
