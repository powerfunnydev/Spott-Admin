import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, spottsEntitiesSelector, topicHasSpottsRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasSpotts } from '../../../..//src/reducers/utils';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { fromJS } from 'immutable';
import { prefix } from './index';

const topicIdSelector = (state, props) => props.topicId;

const isSelectedSelector = (state, props) => state.getIn([ 'content', 'topicSpotts', topicIdSelector(state, props), 'isSelected' ]) || fromJS({ ALL: false });
const pageCountSelector = (state, props) => state.getIn([ 'content', 'topicSpotts', topicIdSelector(state, props), 'pageCount' ]) || 0;
const totalResultCountSelector = (state, props) => state.getIn([ 'content', 'topicSpotts', topicIdSelector(state, props), 'totalResultCount' ]) || 0;

const spottsFilterKeySelector = (state, props) => serializeFilterHasSpotts({ ...getInformationFromQuery(props.location.query, prefix), topicId: topicIdSelector(state, props) });

const spottsSelector = createEntitiesByRelationSelector(
  topicHasSpottsRelationsSelector,
  spottsFilterKeySelector,
  spottsEntitiesSelector
);

export default createStructuredSelector({
  spotts: spottsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
