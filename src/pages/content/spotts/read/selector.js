import { createStructuredSelector } from 'reselect';
import {
  spottsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentSpottIdSelector = (state, props) => props.params.brandId;

export const currentSpottSelector = createEntityByIdSelector(spottsEntitiesSelector, currentSpottIdSelector);

export default createStructuredSelector({
  currentSpott: currentSpottSelector
});
