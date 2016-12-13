import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, tvGuideEntriesEntitiesSelector, mediumHasTvGuideEntriesRelationsSelector } from '../../../selectors/data';
import { serializeFilterHasTvGuideEntries } from '../../../..//src/reducers/utils';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { fromJS } from 'immutable';
import { prefix } from './index';

const mediumIdSelector = (state, props) => props.mediumId;

const isSelectedSelector = (state, props) => state.getIn([ 'content', 'mediumTvGuide', mediumIdSelector(state, props), 'isSelected' ]) || fromJS({ ALL: false });
const pageCountSelector = (state, props) => state.getIn([ 'content', 'mediumTvGuide', mediumIdSelector(state, props), 'pageCount' ]) || 0;
const totalResultCountSelector = (state, props) => state.getIn([ 'content', 'mediumTvGuide', mediumIdSelector(state, props), 'totalResultCount' ]) || 0;

const tvGuideEntriesFilterKeySelector = (state, props) => serializeFilterHasTvGuideEntries({ ...getInformationFromQuery(props.location.query, prefix), mediumId: mediumIdSelector(state, props) });

const tvGuideEntriesSelector = createEntitiesByRelationSelector(
  mediumHasTvGuideEntriesRelationsSelector,
  tvGuideEntriesFilterKeySelector,
  tvGuideEntriesEntitiesSelector
);

export default createStructuredSelector({
  tvGuideEntries: tvGuideEntriesSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
