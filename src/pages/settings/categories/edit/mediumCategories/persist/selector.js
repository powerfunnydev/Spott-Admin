import { createStructuredSelector } from 'reselect';
import { localeNamesSelector } from '../../../../../../selectors/global';
import { createFormValueSelector } from '../../../../../../utils';

const formName = 'mediumCategory';
const nameCopySelector = createFormValueSelector(formName, 'nameCopy');

export default createStructuredSelector({
  localeNames: localeNamesSelector,
  nameCopy: nameCopySelector
});
