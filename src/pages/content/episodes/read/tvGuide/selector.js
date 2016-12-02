import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, tvGuideEntriesEntitiesSelector, episodeHasTvGuideEntriesSelector } from '../../../../../selectors/data';
import { serializeFilterHasTvGuideEntries } from '../../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'episodes', 'read', 'tvGuide', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'episodes', 'read', 'tvGuide', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'episodes', 'read', 'tvGuide', 'totalResultCount' ]);

export const tvGuideEntriesFilterKeySelector = (state, props) => { return serializeFilterHasTvGuideEntries(getInformationFromQuery(props.location.query, prefix), 'tvGuide'); };

export const tvGuideEntriesSelector = createEntitiesByRelationSelector(
  episodeHasTvGuideEntriesSelector,
  tvGuideEntriesFilterKeySelector,
  tvGuideEntriesEntitiesSelector
);

export default createStructuredSelector({
  tvGuideEntries: tvGuideEntriesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
