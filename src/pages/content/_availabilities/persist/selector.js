import { createStructuredSelector } from 'reselect';
import { countriesSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';

const mediumTypeSelector = createFormValueSelector('availability', 'mediumType');

const noEndDateSelector = createFormValueSelector('availability', 'noEndDate');

export default createStructuredSelector({
  countries: countriesSelector,
  mediumType: mediumTypeSelector,
  noEndDate: noEndDateSelector
});
