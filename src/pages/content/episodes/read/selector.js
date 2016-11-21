import { createStructuredSelector } from 'reselect';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentEpisodeIdSelector = (state, props) => { return props.params.episodeId; };

export const currentEpisodeSelector = createEntityByIdSelector(mediaEntitiesSelector, currentEpisodeIdSelector);

export default createStructuredSelector({
  currentEpisode: currentEpisodeSelector
});
