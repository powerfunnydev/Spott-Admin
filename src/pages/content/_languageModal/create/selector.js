import { createStructuredSelector } from 'reselect';
import {
  localeNamesSelector
} from '../../../../selectors/global';

// filter locales that aren't supported yet, so the user can select one of those languages
export const filteredLocalesSelector = (state, props) => {
  const localeNames = localeNamesSelector(state);
  const { supportedLocales } = props;
  return localeNames.keySeq().toArray().filter((locale) => (supportedLocales.indexOf(locale) === -1));
};

export default createStructuredSelector({
  filteredLocales: filteredLocalesSelector,
  localeNames: localeNamesSelector
});
