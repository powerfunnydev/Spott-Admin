import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, tvGuideEntriesEntitiesSelector, filterHasTvGuideEntriesRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasTvGuideEntries } from '../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'tvGuide', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'tvGuide', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'tvGuide', 'list', 'totalResultCount' ]);

export const tvGuideEntriesFilterKeySelector = (state, props) => { return serializeFilterHasTvGuideEntries(props.location.query); };

export const tvGuideEntriesSelector = createEntitiesByRelationSelector(
  filterHasTvGuideEntriesRelationsSelector,
  tvGuideEntriesFilterKeySelector,
  tvGuideEntriesEntitiesSelector
);

export default createStructuredSelector({
  tvGuideEntries: tvGuideEntriesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
