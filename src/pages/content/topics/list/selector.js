import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listTopicsEntitiesSelector, filterHasTopicsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasTopics } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'topics', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'topics', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'topics', 'list', 'totalResultCount' ]);

export const topicsFilterKeySelector = (state, props) => serializeFilterHasTopics(props.location.query);

export const topicsSelector = createEntitiesByRelationSelector(
  filterHasTopicsRelationsSelector,
  topicsFilterKeySelector,
  listTopicsEntitiesSelector
);

export default createStructuredSelector({
  topics: topicsSelector,
  listTopicsEntities: listTopicsEntitiesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
