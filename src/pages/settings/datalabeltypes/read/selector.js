import { createStructuredSelector } from 'reselect';
import { datalabeltypesEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentDatalabeltypeIdSelector = (state, props) => props.params.datalabeltypeId;
export const currentDatalabeltypeSelector = createEntityByIdSelector(datalabeltypesEntitiesSelector, currentDatalabeltypeIdSelector);

export default createStructuredSelector({
  currentDatalabeltype: currentDatalabeltypeSelector
});
