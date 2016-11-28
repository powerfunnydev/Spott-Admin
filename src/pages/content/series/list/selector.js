import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listMediaEntitiesSelector, filterHasSeriesEntriesRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasSeriesEntries } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'series', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'series', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'series', 'list', 'totalResultCount' ]);

export const seriesEntriesFilterKeySelector = (state, props) => { return serializeFilterHasSeriesEntries(props.location.query); };

export const seriesEntriesSelector = createEntitiesByRelationSelector(
  filterHasSeriesEntriesRelationsSelector,
  seriesEntriesFilterKeySelector,
  listMediaEntitiesSelector
);

export default createStructuredSelector({
  seriesEntries: seriesEntriesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
