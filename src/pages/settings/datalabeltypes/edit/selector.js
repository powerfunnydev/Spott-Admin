import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import { datalabeltypesEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';

export const currentDatalabeltypeIdSelector = (state, props) => props.params.datalabeltypeId;
export const currentDatalabeltypeSelector = createEntityByIdSelector(datalabeltypesEntitiesSelector, currentDatalabeltypeIdSelector);

const formName = 'datalabeltypeEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const popUpMessageSelector = (state) => state.getIn([ 'content', 'brands', 'edit', 'popUpMessage' ]);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentDatalabeltype: currentDatalabeltypeSelector,
  currentModal: currentModalSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  supportedLocales: supportedLocalesSelector
});
