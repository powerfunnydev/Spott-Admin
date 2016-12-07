import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, tvGuideEntriesEntitiesSelector, mediumHasTvGuideEntriesSelector } from '../../../../../selectors/data';
import { serializeFilterHasTvGuideEntries } from '../../../../../../src/reducers/utils';
import { getInformationFromQuery } from '../../../../_common/components/table/index';
import { prefix } from './index';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'seasons', 'read', 'tvGuide', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'seasons', 'read', 'tvGuide', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'seasons', 'read', 'tvGuide', 'totalResultCount' ]);

// Every tv guide list is unique by a mediumId. Further, we need all information of a query, like current page, total page count,...
export const tvGuideEntriesFilterKeySelector = (state, props) => serializeFilterHasTvGuideEntries({ ...getInformationFromQuery(props.location.query, prefix), mediumId: props.params.episodeId });

export const tvGuideEntriesSelector = createEntitiesByRelationSelector(
  mediumHasTvGuideEntriesSelector,
  tvGuideEntriesFilterKeySelector,
  tvGuideEntriesEntitiesSelector
);

export default createStructuredSelector({
  tvGuideEntries: tvGuideEntriesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
