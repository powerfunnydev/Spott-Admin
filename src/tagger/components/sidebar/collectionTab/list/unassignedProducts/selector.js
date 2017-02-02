import { createSelector, createStructuredSelector } from 'reselect';
import { currentMediumIdSelector } from '../../../../../selectors/common';
import {
  createEntitiesByRelationSelector,
  listProductsEntitiesSelector,
  mediumHasUnassignedProductsRelationsSelector
} from '../../../../../../selectors/data';

const unassignedProductsSelector = createEntitiesByRelationSelector(mediumHasUnassignedProductsRelationsSelector, currentMediumIdSelector, listProductsEntitiesSelector);

export default createStructuredSelector({
  mediumId: currentMediumIdSelector,
  unassignedProducts: unassignedProductsSelector
});
