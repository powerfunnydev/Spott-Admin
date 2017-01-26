import { createStructuredSelector } from 'reselect';
import { createFormValueSelector } from '../../../../../utils';
import {
  currentLocaleSelector,
  localeNamesSelector
} from '../../../../../selectors/global';

const linkTypeSelector = createFormValueSelector('taggerCollection', 'linkType');

export default createStructuredSelector({
  currentLinkType: linkTypeSelector,
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
