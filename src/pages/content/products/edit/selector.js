import { createSelector, createStructuredSelector } from 'reselect';
import { List } from 'immutable';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  productsEntitiesSelector,
  createEntityByIdSelector,
  listBrandsEntitiesSelector,
  listProductCategoriesEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBrandsRelationsSelector,
  searchStringHasProductCategoriesRelationsSelector
} from '../../../../selectors/data';

const formName = 'productEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentProductIdSelector = (state, props) => { return props.params.productId; };
const currentProductSelector = createEntityByIdSelector(productsEntitiesSelector, currentProductIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'popUpMessage' ]);

const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'currentBrandsSearchString' ]);
const currentProductCategoriesSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'currentProductCategoriesSearchString' ]);

const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);
const searchedProductCategoryIdsSelector = createEntityIdsByRelationSelector(searchStringHasProductCategoriesRelationsSelector, currentProductCategoriesSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  brandsById: listBrandsEntitiesSelector,
  productCategoriesById: listProductCategoriesEntitiesSelector,
  currentModal: currentModalSelector,
  currentProduct: currentProductSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedProductCategoryIds: searchedProductCategoryIdsSelector,
  supportedLocales: supportedLocalesSelector
});
