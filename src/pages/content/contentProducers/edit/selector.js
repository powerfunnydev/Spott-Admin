import { createStructuredSelector } from 'reselect';
import { contentProducersEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentContentProducerIdSelector = (state, props) => props.params.id;
export const currentContentProducerSelector = createEntityByIdSelector(contentProducersEntitiesSelector, currentContentProducerIdSelector);

export default createStructuredSelector({
  currentContentProducer: currentContentProducerSelector
});
