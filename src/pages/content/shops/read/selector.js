import { createStructuredSelector } from 'reselect';
import {
  shopsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentShopIdSelector = (state, props) => { return props.params.shopId; };

export const currentShopSelector = createEntityByIdSelector(shopsEntitiesSelector, currentShopIdSelector);

export default createStructuredSelector({
  currentShop: currentShopSelector
});
