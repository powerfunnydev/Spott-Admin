import { createStructuredSelector } from 'reselect';
import {
  currentLocaleSelector,
  gendersSelector,
  localeNamesSelector
} from '../../../../selectors/global';

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  genders: gendersSelector,
  localeNames: localeNamesSelector
});
