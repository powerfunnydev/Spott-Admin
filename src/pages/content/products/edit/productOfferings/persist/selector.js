import { createStructuredSelector } from 'reselect';
import { currenciesSelector, localeNamesSelector } from '../../../../../../selectors/global';
import {
  listShopsEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasShopsRelationsSelector
} from '../../../../../../selectors/data';

export const currentShopsSearchStringSelector = (state) => state.getIn([ 'content', 'products', 'edit', 'currentShopsSearchString' ]);

export const searchedShopIdsSelector = createEntityIdsByRelationSelector(searchStringHasShopsRelationsSelector, currentShopsSearchStringSelector);

export default createStructuredSelector({
  shopsById: listShopsEntitiesSelector,
  searchedShopIds: searchedShopIdsSelector,
  currencies: currenciesSelector,
  localeNames: localeNamesSelector
});
