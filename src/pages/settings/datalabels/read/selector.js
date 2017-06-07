import { createStructuredSelector } from 'reselect';
import { datalabelsEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentDatalabelIdSelector = (state, props) => props.params.datalabelId;
export const currentDatalabelSelector = createEntityByIdSelector(datalabelsEntitiesSelector, currentDatalabelIdSelector);

export default createStructuredSelector({
  currentDatalabel: currentDatalabelSelector
});
