import { createSelector } from 'reselect';
import {
  appearanceEntitiesSelector, createEntityIdsByRelationSelector,
  createEntitiesByRelationSelector, productSearchRelationsSelector,
  productSearchStringSelector, productEntitiesSelector, updateAppearanceIdSelector,
  productHasSimilarProductsRelationsSelector
} from './common';
import { tooltipSelector } from './global';

const productSearchResultSelector = createEntitiesByRelationSelector(productSearchRelationsSelector, productSearchStringSelector, productEntitiesSelector);

const currentCreateProductMarkerProductIdSelector = (state) => {
  const createProductMarkerForm = state.get('form').createProductMarker;
  return createProductMarkerForm && createProductMarkerForm.productId && createProductMarkerForm.productId.value;
};

const createProductMarkerSimilarProductsSelector = createSelector(
  productEntitiesSelector,
  createEntityIdsByRelationSelector(productHasSimilarProductsRelationsSelector, currentCreateProductMarkerProductIdSelector),
  (productsById, relation) => relation.set('data', relation.get('data').map((rel) => rel.set('product', productsById.get(rel.get('productId')))))
);

export const createProductMarkerSelector = (state) => ({
  products: productEntitiesSelector(state),
  productSearchResult: productSearchResultSelector(state),
  similarProducts: createProductMarkerSimilarProductsSelector(state),
  tooltip: tooltipSelector(state)
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
const initialValuesSelector = createSelector(
  appearanceSelector,
  (appearance) => {
    const { appearanceId, characterId, markerHidden, point, id: productId, relevance } = appearance.toJS();
    return {
      appearanceId,
      characterId,
      markerHidden,
      point,
      productId,
      relevance
    };
  }
);

const currentUpdateProductMarkerProductIdSelector = (state) => {
  const updateProductMarkerForm = state.get('form').updateProductMarker;
  return updateProductMarkerForm && updateProductMarkerForm.productId && updateProductMarkerForm.productId.value;
};

const updateProductMarkerSimilarProductsSelector = createSelector(
  productEntitiesSelector,
  createEntityIdsByRelationSelector(productHasSimilarProductsRelationsSelector, currentUpdateProductMarkerProductIdSelector),
  (productsById, relation) => relation.set('data', relation.get('data').map((rel) => rel.set('product', productsById.get(rel.get('productId')))))
);

export const updateProductMarkerSelector = (state) => ({
  initialValues: initialValuesSelector(state),
  products: productEntitiesSelector(state),
  productSearchResult: productSearchResultSelector(state),
  similarProducts: updateProductMarkerSimilarProductsSelector(state),
  tooltip: tooltipSelector(state)
});
