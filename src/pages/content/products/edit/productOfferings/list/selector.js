import { createStructuredSelector } from 'reselect';
import {
  productOfferingsEntitiesSelector,
  createEntitiesByRelationSelector,
  productHasProductOfferingsRelationsSelector
} from '../../../../../../selectors/data';

const currentProductIdSelector = (state, props) => props.productId;

const productOfferingsSelector = createEntitiesByRelationSelector(
  productHasProductOfferingsRelationsSelector,
  currentProductIdSelector,
  productOfferingsEntitiesSelector
);
export default createStructuredSelector({
  productOfferings: productOfferingsSelector
});
