import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByRelationSelector,
  listMediaEntitiesSelector,
  seriesEntryHasSeasonsSelector,
  createEntityByIdSelector
} from '../../../../../selectors/data';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'series', 'read', 'seasons', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'series', 'read', 'seasons', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'series', 'read', 'seasons', 'totalResultCount' ]);

export const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };

export const currentSeriesEntrySelector = createEntityByIdSelector(listMediaEntitiesSelector, currentSeriesEntryIdSelector);

export const seasonsSelector = createEntitiesByRelationSelector(
  seriesEntryHasSeasonsSelector,
  currentSeriesEntryIdSelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  seasons: seasonsSelector,
  currentSeriesEntry: currentSeriesEntrySelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
