import { createStructuredSelector } from 'reselect';
import { countriesSelector } from '../../../../selectors/global';

export default createStructuredSelector({
  countries: countriesSelector
});
