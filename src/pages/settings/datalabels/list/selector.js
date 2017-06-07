import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, datalabelsEntitiesSelector, filterHasDatalabelsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasDatalabels } from '../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'settings', 'datalabels', 'list', 'datalabels', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'settings', 'datalabels', 'list', 'datalabels', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'settings', 'datalabels', 'list', 'datalabels', 'totalResultCount' ]);

export const datalabelsFilterKeySelector = (state, props) => serializeFilterHasDatalabels(getInformationFromQuery(props.location.query, prefix));

export const datalabelsSelector = createEntitiesByRelationSelector(
  filterHasDatalabelsRelationsSelector,
  datalabelsFilterKeySelector,
  datalabelsEntitiesSelector
);

export default createStructuredSelector({
  datalabels: datalabelsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
