import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  productsEntitiesSelector,
  createEntityByIdSelector,
  listBrandsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBrandsRelationsSelector
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

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'currentBrandSearchString' ]);

export const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  brandsById: listBrandsEntitiesSelector,
  currentModal: currentModalSelector,
  currentProduct: currentProductSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  supportedLocales: supportedLocalesSelector
});
