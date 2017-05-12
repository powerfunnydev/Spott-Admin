import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, interactiveVideosEntitiesSelector, filterHasInteractiveVideosRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasInteractiveVideos } from '../../../../../src/reducers/utils';

const isSelectedSelector = (state) => state.getIn([ 'content', 'interactiveVideos', 'list', 'isSelected' ]);
const pageCountSelector = (state) => state.getIn([ 'content', 'interactiveVideos', 'list', 'pageCount' ]);
const totalResultCountSelector = (state) => state.getIn([ 'content', 'interactiveVideos', 'list', 'totalResultCount' ]);

const interactiveVideosFilterKeySelector = (state, props) => { return serializeFilterHasInteractiveVideos(props.location.query); };

const interactiveVideosSelector = createEntitiesByRelationSelector(
  filterHasInteractiveVideosRelationsSelector,
  interactiveVideosFilterKeySelector,
  interactiveVideosEntitiesSelector
);

export default createStructuredSelector({
  interactiveVideos: interactiveVideosSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
