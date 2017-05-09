import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, cropsEntitiesSelector, mediumHasCropsRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasCrops } from '../../../..//src/reducers/utils';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { fromJS } from 'immutable';
import { prefix } from './index';

const mediumIdSelector = (state, props) => props.mediumId;

const isSelectedSelector = (state, props) => state.getIn([ 'content', 'mediumCrops', mediumIdSelector(state, props), 'isSelected' ]) || fromJS({ ALL: false });
const pageCountSelector = (state, props) => state.getIn([ 'content', 'mediumCrops', mediumIdSelector(state, props), 'pageCount' ]) || 0;
const totalResultCountSelector = (state, props) => state.getIn([ 'content', 'mediumCrops', mediumIdSelector(state, props), 'totalResultCount' ]) || 0;

const cropsFilterKeySelector = (state, props) => serializeFilterHasCrops({ ...getInformationFromQuery(props.location.query, prefix), mediumId: mediumIdSelector(state, props) });

const cropsSelector = createEntitiesByRelationSelector(
  mediumHasCropsRelationsSelector,
  cropsFilterKeySelector,
  cropsEntitiesSelector
);

export default createStructuredSelector({
  crops: cropsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
