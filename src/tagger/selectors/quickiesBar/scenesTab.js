import { createSelector, createStructuredSelector } from 'reselect';
import {
  characterEntitiesSelector, createEntitiesByRelationSelector, currentMediumIdSelector,
  mediaEntitiesSelector, mediumHasProductGroupsRelationsSelector, productEntitiesSelector, productGroupEntitiesSelector
} from '../common';
import { selectedProductIdSelector } from '.';

export const currentEditProductGroupIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'currentEditProductGroupId' ]);

export const currentRootMediumIdSelector = createSelector(
  mediaEntitiesSelector,
  currentMediumIdSelector,
  (media, mediumId) => media && mediumId && media.getIn([ mediumId, 'rootMediumId' ])
);

export const productGroupsSelector = createEntitiesByRelationSelector(mediumHasProductGroupsRelationsSelector, currentRootMediumIdSelector, productGroupEntitiesSelector);

export default createStructuredSelector({
  characters: characterEntitiesSelector,
  currentEditProductGroupId: currentEditProductGroupIdSelector,
  productGroups: productGroupsSelector,
  products: productEntitiesSelector,
  selectedProductId: selectedProductIdSelector
});
