import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listMediaEntitiesSelector, filterHasMediaRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasMedia } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'media', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'media', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'media', 'list', 'totalResultCount' ]);

export const mediaFilterKeySelector = (state, props) => { return serializeFilterHasMedia(props.location.query); };

export const mediaSelector = createEntitiesByRelationSelector(
  filterHasMediaRelationsSelector,
  mediaFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  media: mediaSelector,
  listMedia: listMediaEntitiesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
