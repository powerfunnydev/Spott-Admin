import { createStructuredSelector } from 'reselect';
import { createEntityByIdSelector, createEntitiesByRelationSelector, tvGuideEntriesEntitiesSelector, filterHasTvGuideEntriesRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasTvGuideEntries } from '../../../../src/reducers/utils';

export const selectedEntityIdSelector = (state) => state.getIn([ 'tvGuide', 'list', 'selectedEntity' ]);
export const isSelectedSelector = (state) => state.getIn([ 'tvGuide', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'tvGuide', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'tvGuide', 'list', 'totalResultCount' ]);

export const selectedEntitySelector = createEntityByIdSelector(tvGuideEntriesEntitiesSelector, selectedEntityIdSelector);

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
  selectedEntity: selectedEntitySelector,
  totalResultCount: totalResultCountSelector
});
