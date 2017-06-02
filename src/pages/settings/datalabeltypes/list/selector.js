import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, datalabeltypesEntitiesSelector, filterHasDatalabeltypesRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasDatalabeltypes } from '../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'settings', 'datalabeltypes', 'list', 'datalabeltypes', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'settings', 'datalabeltypes', 'list', 'datalabeltypes', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'settings', 'datalabeltypes', 'list', 'datalabeltypes', 'totalResultCount' ]);

export const datalabeltypesFilterKeySelector = (state, props) => serializeFilterHasDatalabeltypes(getInformationFromQuery(props.location.query, prefix));

export const datalabeltypesSelector = createEntitiesByRelationSelector(
  filterHasDatalabeltypesRelationsSelector,
  datalabeltypesFilterKeySelector,
  datalabeltypesEntitiesSelector
);

export default createStructuredSelector({
  datalabeltypes: datalabeltypesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
