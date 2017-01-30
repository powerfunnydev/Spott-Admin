import { createSelector, createStructuredSelector } from 'reselect';
import { createFormValueSelector } from '../../../../../utils';
import {
  currentLocaleSelector,
  localeNamesSelector
} from '../../../../../selectors/global';

const basedOnDefaultLocaleSelector = createFormValueSelector('taggerCollection', 'basedOnDefaultLocale');
const linkTypeSelector = createFormValueSelector('taggerCollection', 'linkType');
const _defaultLocaleSelector = createFormValueSelector('taggerCollection', 'defaultLocale');
const _titleSelector = createFormValueSelector('taggerCollection', 'title');
const defaultLocaleSelector = createSelector(_defaultLocaleSelector, (locale) => locale || 'en');
const defaultLocaleTitleSelector = createSelector(
  defaultLocaleSelector,
  _titleSelector,
  (defaultLocale, titles) => titles && titles.get(defaultLocale)
);
const totalTitlesSelector = createSelector(
  localeNamesSelector,
  (locales) => locales.size - 1
);
const countTitlesSelector = createSelector(
  defaultLocaleSelector,
  _titleSelector,
  localeNamesSelector,
  (defaultLocale, titles, locales) => locales.count((_, locale) => defaultLocale !== locale && titles && titles.get(locale))
);

export default createStructuredSelector({
  basedOnDefaultLocale: basedOnDefaultLocaleSelector,
  countTitles: countTitlesSelector,
  currentLinkType: linkTypeSelector,
  currentLocale: currentLocaleSelector,
  defaultLocale: defaultLocaleSelector,
  localeNames: localeNamesSelector,
  title: defaultLocaleTitleSelector,
  totalTitles: totalTitlesSelector
});
