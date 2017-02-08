import { createStructuredSelector } from 'reselect';
import { currentModalSelector, countriesSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  shopsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

const formName = 'shopEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentShopIdSelector = (state, props) => { return props.params.shopId; };
const currentShopSelector = createEntityByIdSelector(shopsEntitiesSelector, currentShopIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'shops', 'edit', 'popUpMessage' ]);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentShop: currentShopSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  supportedLocales: supportedLocalesSelector,
  countries: countriesSelector
});
