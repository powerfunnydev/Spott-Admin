import { createStructuredSelector } from 'reselect';
import {
  productsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentProductIdSelector = (state, props) => { return props.params.productId; };

export const currentProductSelector = createEntityByIdSelector(productsEntitiesSelector, currentProductIdSelector);

export default createStructuredSelector({
  currentProduct: currentProductSelector
});
