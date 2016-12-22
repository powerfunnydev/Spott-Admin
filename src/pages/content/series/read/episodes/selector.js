import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByRelationSelector,
  listMediaEntitiesSelector,
  seriesEntryHasEpisodesRelationsSelector,
  createEntityByIdSelector
} from '../../../../../selectors/data';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'series', 'read', 'episodes', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'series', 'read', 'episodes', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'series', 'read', 'episodes', 'totalResultCount' ]);

export const currentSeriesEntryIdSelector = (state, props) => { return props.params.seriesEntryId; };

export const currentSeriesEntrySelector = createEntityByIdSelector(listMediaEntitiesSelector, currentSeriesEntryIdSelector);

export const episodesSelector = createEntitiesByRelationSelector(
  seriesEntryHasEpisodesRelationsSelector,
  currentSeriesEntryIdSelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  episodes: episodesSelector,
  currentSeriesEntry: currentSeriesEntrySelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
