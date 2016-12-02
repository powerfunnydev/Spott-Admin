import { createStructuredSelector } from 'reselect';
import { countriesSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';

const noEndDateSelector = createFormValueSelector('availability', 'noEndDate');

export default createStructuredSelector({
  countries: countriesSelector,
  noEndDate: noEndDateSelector
});
