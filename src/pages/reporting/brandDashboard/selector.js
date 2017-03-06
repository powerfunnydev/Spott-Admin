import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByRelationSelector, filterHasTopMediaRelationsSelector,
  filterHasTopPeopleRelationsSelector, topMediaEntitiesSelector, topPeopleEntitiesSelector
} from '../../../selectors/data';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { serializeFilterHasTopMedia, serializeFilterHasTopPeople } from '../../../reducers/utils';

// Filters
// ///////
import {
  createEntityIdsByRelationSelector,
  searchStringHasMediaRelationsSelector,
  listMediaEntitiesSelector
} from '../../../selectors/data';

const currentMediaSearchStringSelector = (state) => state.getIn([ 'reporting', 'currentMediaSearchString' ]);
const searchedMediumIdsSelector = createEntityIdsByRelationSelector(searchStringHasMediaRelationsSelector, currentMediaSearchStringSelector);

// Header
// //////

// export default createStructuredSelector({
//   mediaById: listMediaEntitiesSelector,
//   searchedMediumIds: searchedMediumIdsSelector
// });

// Brand Dashboard
// ///////////////

export const topMediaPrefix = 'topMedia';
export const topPeoplePrefix = 'topPeople';

const topMediaFilterKeySelector = (state, props) => serializeFilterHasTopMedia({
  ...getInformationFromQuery(props.location.query, topMediaPrefix)
  // brandId: 'BRAND_ID_PLACEHOLDER'
});

const topPeopleFilterKeySelector = (state, props) => serializeFilterHasTopPeople({
  ...getInformationFromQuery(props.location.query, topPeoplePrefix)
  // brandId: 'BRAND_ID_PLACEHOLDER'
});

export const topMediaSelector = createEntitiesByRelationSelector(
  filterHasTopMediaRelationsSelector,
  topMediaFilterKeySelector,
  topMediaEntitiesSelector
);

export const topPeopleSelector = createEntitiesByRelationSelector(
  filterHasTopPeopleRelationsSelector,
  topPeopleFilterKeySelector,
  topPeopleEntitiesSelector
);

export default createStructuredSelector({
  topMedia: topMediaSelector,
  topPeople: topPeopleSelector
});
