import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { mediaEntitiesSelector, createEntityByIdSelector } from '../../../../selectors/data';
import { createFormValueSelector } from '../../../../utils';

const formName = 'seriesEntryEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };
const currentSeriesEntrySelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeriesEntryIdSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'series', 'edit', 'popUpMessage' ]);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentSeriesEntry: currentSeriesEntrySelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  formValues: valuesSelector,
  popUpMessage: popUpMessageSelector,
  supportedLocales: supportedLocalesSelector
});
