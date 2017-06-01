import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, broadcastersEntitiesSelector, filterHasBroadcastersRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasBroadcasters } from '../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'settings', 'datalabeltypes', 'list', 'datalabeltypes', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'settings', 'datalabeltypes', 'list', 'datalabeltypes', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'settings', 'datalabeltypes', 'list', 'datalabeltypes', 'totalResultCount' ]);

export const broadcastersFilterKeySelector = (state, props) => serializeFilterHasBroadcasters(getInformationFromQuery(props.location.query, prefix));

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
