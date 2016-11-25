import { createStructuredSelector } from 'reselect';
import {
  localeNamesSelector
} from '../../../selectors/global';

export default createStructuredSelector({
  localeNames: localeNamesSelector
});
