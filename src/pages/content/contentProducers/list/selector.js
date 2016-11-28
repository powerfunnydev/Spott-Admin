import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, contentProducersEntitiesSelector, filterHasContentProducersRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasContentProducers } from '../../../../../src/reducers/utils';

const isSelectedSelector = (state) => state.getIn([ 'content', 'contentProducers', 'list', 'isSelected' ]);
const pageCountSelector = (state) => state.getIn([ 'content', 'contentProducers', 'list', 'pageCount' ]);
const totalResultCountSelector = (state) => state.getIn([ 'content', 'contentProducers', 'list', 'totalResultCount' ]);

const contentProducersFilterKeySelector = (state, props) => { return serializeFilterHasContentProducers(props.location.query); };

const contentProducersSelector = createEntitiesByRelationSelector(
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
