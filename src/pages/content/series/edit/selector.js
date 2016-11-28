import { createSelector, createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';
import { getFormValues } from 'redux-form/immutable';

const formName = 'seriesEntryEdit';
const formSelector = getFormValues(formName);
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

export const currentDefaultLocaleSelector = createSelector(
  formSelector,
  (form) => (form && form.get('defaultLocale'))
);
export const _activeDefaultLocaleSelector = createSelector(
  formSelector,
  (form) => (form && form.get('_activeLocale'))
);
export const availabilitiesSelector = createSelector(
  formSelector,
  (form) => (form && form.get('availabilities'))
);
export const supportedLocalesSelector = createSelector(
  formSelector,
  (form) => (form && form.get('locales'))
);
export const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };
export const currentSeriesEntrySelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  _activeLocale: _activeDefaultLocaleSelector,
  availabilities: availabilitiesSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  currentModal: currentModalSelector,
  currentSeriesEntry: currentSeriesEntrySelector,
  supportedLocales: supportedLocalesSelector
});
