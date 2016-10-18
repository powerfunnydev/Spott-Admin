import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, contentProducersEntitiesSelector, filterHasContentProducersRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasContentProducers } from '../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'contentProducers', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'contentProducers', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'contentProducers', 'totalResultCount' ]);

export const contentProducersFilterKeySelector = (state, props) => { return serializeFilterHasContentProducers(props.location.query); };

export const contentProducersSelector = createEntitiesByRelationSelector(
  filterHasContentProducersRelationsSelector,
  contentProducersFilterKeySelector,
  contentProducersEntitiesSelector
);

export default createStructuredSelector({
  contentProducers: contentProducersSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
