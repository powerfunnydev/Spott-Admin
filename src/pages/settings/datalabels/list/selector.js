import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listProductLabelsEntitiesSelector, filterHasProductLabelsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasProductLabels } from '../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'settings', 'datalabels', 'list', 'datalabels', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'settings', 'datalabels', 'list', 'datalabels', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'settings', 'datalabels', 'list', 'datalabels', 'totalResultCount' ]);

export const datalabelsFilterKeySelector = (state, props) => serializeFilterHasProductLabels(getInformationFromQuery(props.location.query, prefix));

export const datalabelsSelector = createEntitiesByRelationSelector(
  filterHasProductLabelsRelationsSelector,
  datalabelsFilterKeySelector,
  listProductLabelsEntitiesSelector
);

export default createStructuredSelector({
  datalabels: datalabelsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
