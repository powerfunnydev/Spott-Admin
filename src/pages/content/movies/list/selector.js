import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listMediaEntitiesSelector, filterHasMoviesRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasMovies } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'movies', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'movies', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'movies', 'list', 'totalResultCount' ]);

export const moviesFilterKeySelector = (state, props) => serializeFilterHasMovies(props.location.query);

export const moviesSelector = createEntitiesByRelationSelector(
  filterHasMoviesRelationsSelector,
  moviesFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  movies: moviesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
