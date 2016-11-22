import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listMediaEntitiesSelector, filterHasEpisodesRelationsSelector } from '../../../../selectors/data';
import { serialize } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'episodes', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'episodes', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'episodes', 'list', 'totalResultCount' ]);

export const episodesFilterKeySelector = (state, props) => { return serialize(props.location.query); };

export const episodesSelector = createEntitiesByRelationSelector(
  filterHasEpisodesRelationsSelector,
  episodesFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  episodes: episodesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
