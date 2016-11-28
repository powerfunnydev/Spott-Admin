import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listMediaEntitiesSelector, filterHasSeasonsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasSeasons } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'seasons', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'seasons', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'seasons', 'list', 'totalResultCount' ]);

export const seasonsFilterKeySelector = (state, props) => { return serializeFilterHasSeasons(props.location.query); };

export const seasonsSelector = createEntitiesByRelationSelector(
  filterHasSeasonsRelationsSelector,
  seasonsFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  seasons: seasonsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
