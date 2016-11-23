import { createSelector, createStructuredSelector } from 'reselect';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';
import {
  mediaEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';
import { getFormValues } from 'redux-form/immutable';

const formSelector = getFormValues('seriesEntryEdit');

export const currentDefaultLocaleSelector = createSelector(
  formSelector,
  (form) => (form && form.get('defaultLocale'))
);

export const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };
export const currentSeriesEntrySelector = createEntityByIdSelector(mediaEntitiesSelector, currentSeriesEntryIdSelector);

export default createStructuredSelector({
  currentDefaultLocale: currentDefaultLocaleSelector,
  currentSeriesEntry: currentSeriesEntrySelector,
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
