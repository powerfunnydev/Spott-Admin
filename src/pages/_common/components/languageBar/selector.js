import { createStructuredSelector } from 'reselect';
import {
  localeNamesSelector,
  currentModalSelector
} from '../../../../selectors/global';

export default createStructuredSelector({
  currentModal: currentModalSelector,
  localeNames: localeNamesSelector
});
