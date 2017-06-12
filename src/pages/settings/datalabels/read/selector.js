import { createStructuredSelector } from 'reselect';
import { listProductLabelsEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentDatalabelIdSelector = (state, props) => props.params.datalabelId;
export const currentDatalabelSelector = createEntityByIdSelector(listProductLabelsEntitiesSelector, currentDatalabelIdSelector);

export default createStructuredSelector({
  currentDatalabel: currentDatalabelSelector
});
