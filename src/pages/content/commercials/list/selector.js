import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByRelationSelector,
  createEntityIdsByRelationSelector,
  listBrandsEntitiesSelector,
  listMediaEntitiesSelector,
  filterHasCommercialsRelationsSelector,
  searchStringHasBrandsRelationsSelector
} from '../../../../selectors/data';
import { serialize } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'totalResultCount' ]);

export const commercialsFilterKeySelector = (state, props) => { return serialize(props.location.query); };

const currentBrandsSearchStringSelector = (state) => state.getIn([ 'content', 'commercials', 'list', 'currentBrandsSearchString' ]);
const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);

export const commercialsSelector = createEntitiesByRelationSelector(
  filterHasCommercialsRelationsSelector,
  commercialsFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  brandsById: listBrandsEntitiesSelector,
  commercials: commercialsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  totalResultCount: totalResultCountSelector
});
