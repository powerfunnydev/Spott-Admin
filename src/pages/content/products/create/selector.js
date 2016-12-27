import { createStructuredSelector } from 'reselect';
import {
  currentLocaleSelector,
  localeNamesSelector
} from '../../../../selectors/global';
import {
  listBrandsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBrandsRelationsSelector
} from '../../../../selectors/data';

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'create', 'currentBrandSearchString' ]);

export const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  brandsById: listBrandsEntitiesSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector
});
