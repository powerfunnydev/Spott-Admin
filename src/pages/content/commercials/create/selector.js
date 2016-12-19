import { createStructuredSelector } from 'reselect';
import {
  createEntityIdsByRelationSelector,
  listBrandsEntitiesSelector,
  searchStringHasBrandsRelationsSelector
} from '../../../../selectors/data';
import {
  localeNamesSelector,
  currentLocaleSelector
} from '../../../../selectors/global';

export const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'create', 'currentBrandsSearchString' ]);

export const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);

export default createStructuredSelector({
  currentLocale: currentLocaleSelector,
  localeNames: localeNamesSelector,
  brandsById: listBrandsEntitiesSelector,
  searchedBrandIds: searchedBrandIdsSelector
});
