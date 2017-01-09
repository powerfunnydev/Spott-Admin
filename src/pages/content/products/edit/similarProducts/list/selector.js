import { createStructuredSelector } from 'reselect';
import {
  similarProductsEntitiesSelector,
  createEntitiesByRelationSelector,
  productHasSimilarProductsRelationsSelector
} from '../../../../../../selectors/data';

const currentProductIdSelector = (state, props) => props.productId;

const similarProductsSelector = createEntitiesByRelationSelector(
  productHasSimilarProductsRelationsSelector,
  currentProductIdSelector,
  similarProductsEntitiesSelector
);
export default createStructuredSelector({
  similarProducts: similarProductsSelector
});
