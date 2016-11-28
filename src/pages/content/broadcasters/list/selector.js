import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, broadcastersEntitiesSelector, filterHasBroadcastersRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasBroadcasters } from '../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'broadcasters', 'list', 'broadcasters', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'list', 'broadcasters', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'broadcasters', 'list', 'broadcasters', 'totalResultCount' ]);

export const broadcastersFilterKeySelector = (state, props) => { return serializeFilterHasBroadcasters(getInformationFromQuery(props.location.query, prefix)); };

export const broadcastersSelector = createEntitiesByRelationSelector(
  filterHasBroadcastersRelationsSelector,
  broadcastersFilterKeySelector,
  broadcastersEntitiesSelector
);

export default createStructuredSelector({
  broadcasters: broadcastersSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
