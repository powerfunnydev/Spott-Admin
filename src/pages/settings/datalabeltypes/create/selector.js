import { createStructuredSelector } from 'reselect';

import {
  currentLocaleSelector,
  localeNamesSelector
} from '../../../../selectors/global';

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
