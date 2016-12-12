import { createStructuredSelector } from 'reselect';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentMovieIdSelector = (state, props) => { return props.params.movieId; };

export const currentMovieSelector = createEntityByIdSelector(mediaEntitiesSelector, currentMovieIdSelector);

export default createStructuredSelector({
  currentMovie: currentMovieSelector
});
