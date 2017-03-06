import { createStructuredSelector } from 'reselect';
import {
  createEntityIdsByRelationSelector,
  searchStringHasMediaRelationsSelector,
  listMediaEntitiesSelector
} from '../../../selectors/data';

const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);
const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);

// Header
// //////

export default createStructuredSelector({
  mediaById: listMediaEntitiesSelector,
  searchedMediumIds: searchedMediumIdsSelector
});
