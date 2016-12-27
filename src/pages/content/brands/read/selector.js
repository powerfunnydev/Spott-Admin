import { createStructuredSelector } from 'reselect';
import {
  brandsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentBrandIdSelector = (state, props) => { return props.params.brandId; };

export const currentBrandSelector = createEntityByIdSelector(brandsEntitiesSelector, currentBrandIdSelector);

export default createStructuredSelector({
  currentBrand: currentBrandSelector
});
