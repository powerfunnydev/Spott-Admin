import { createSelector, createStructuredSelector } from 'reselect';
import {
  appearanceEntitiesSelector, createEntityIdsByRelationSelector,
  createEntitiesByRelationSelector, productSearchRelationsSelector,
  productSearchStringSelector, productEntitiesSelector, updateAppearanceIdSelector,
  productHasSimilarProductsRelationsSelector
} from './common';
import { tooltipSelector } from './global';
import { createFormValueSelector } from '../../utils';

const productSearchResultSelector = createEntitiesByRelationSelector(productSearchRelationsSelector, productSearchStringSelector, productEntitiesSelector);

const currentCreateProductMarkerProductIdSelector = createFormValueSelector('createProductMarker', 'productId');

const createProductMarkerSimilarProductsSelector = createSelector(
  productEntitiesSelector,
  createEntityIdsByRelationSelector(productHasSimilarProductsRelationsSelector, currentCreateProductMarkerProductIdSelector),
  (productsById, relation) => relation.set('data', relation.get('data').map((rel) => rel.set('product', productsById.get(rel.get('productId')))))
);

export const createProductMarkerSelector = createStructuredSelector({
  productId: currentCreateProductMarkerProductIdSelector,
  products: productEntitiesSelector,
  productSearchResult: productSearchResultSelector,
  similarProducts: createProductMarkerSimilarProductsSelector,
  tooltip: tooltipSelector
});

export const appearanceSelector = createSelector(
  updateAppearanceIdSelector,
  appearanceEntitiesSelector,
  (updateAppearanceId, appearances) => appearances.get(updateAppearanceId)
);

// Initial values of the redux-form.
// We don't use initialValues as key, because this is the one used for redux-form.
// The form will render without initialValues and then with.
// Typeahead won't rerender the input value with the product name.
// So we must ensure that all data is rendered correctly from the first time.
// const initialValuesSelector = createSelector(
//   appearanceSelector,
//   (appearance) => {
//     const { appearanceId, characterId, markerHidden, point, id: productId, relevance } = appearance.toJS();
//     return {
//       appearanceId,
//       characterId,
//       markerHidden,
//       point,
//       productId,
//       relevance
//     };
//   }
// );

const currentUpdateProductMarkerProductIdSelector = createFormValueSelector('updateProductMarker', 'productId');

const updateProductMarkerSimilarProductsSelector = createSelector(
  productEntitiesSelector,
  createEntityIdsByRelationSelector(productHasSimilarProductsRelationsSelector, currentUpdateProductMarkerProductIdSelector),
  (productsById, relation) => relation.set('data', relation.get('data').map((rel) => rel.set('product', productsById.get(rel.get('productId')))))
);

export const updateProductMarkerSelector = (state) => createStructuredSelector({
  appearance: appearanceSelector,
  productId: currentUpdateProductMarkerProductIdSelector,
  products: productEntitiesSelector,
  productSearchResult: productSearchResultSelector,
  similarProducts: updateProductMarkerSimilarProductsSelector,
  tooltip: tooltipSelector
});
