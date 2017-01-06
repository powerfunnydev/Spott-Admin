import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByRelationSelector,
  filterHasProductCategoriesRelationsSelector,
  listProductCategoriesEntitiesSelector
} from '../../../../../../selectors/data';
import { serializeFilterHasProductCategories } from '../../../../../../reducers/utils';

export const productCategoriesFilterKeySelector = (state, props) => { return serializeFilterHasProductCategories({}); };

export const productCategoriesSelector = createEntitiesByRelationSelector(
  filterHasProductCategoriesRelationsSelector,
  productCategoriesFilterKeySelector,
  listProductCategoriesEntitiesSelector
);
export default createStructuredSelector({
  productCategories: productCategoriesSelector
});
