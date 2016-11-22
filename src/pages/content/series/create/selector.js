import { createStructuredSelector } from 'reselect';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
