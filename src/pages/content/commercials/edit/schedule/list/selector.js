import { createStructuredSelector } from 'reselect';
import {
  scheduleEntriesEntitiesSelector,
  commercialHasScheduleEntriesRelationsSelector,
  createEntitiesByRelationSelector
} from '../../../../../../selectors/data';

const currentCommercialIdSelector = (state, props) => props.commercialId;

const scheduleEntriesSelector = createEntitiesByRelationSelector(
  commercialHasScheduleEntriesRelationsSelector,
  currentCommercialIdSelector,
  scheduleEntriesEntitiesSelector
);
export default createStructuredSelector({
  scheduleEntries: scheduleEntriesSelector
});
