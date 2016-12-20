import { createStructuredSelector } from 'reselect';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentCommercialIdSelector = (state, props) => props.params.commercialId;

export const currentCommercialSelector = createEntityByIdSelector(mediaEntitiesSelector, currentCommercialIdSelector);

export default createStructuredSelector({
  currentCommercial: currentCommercialSelector
});
