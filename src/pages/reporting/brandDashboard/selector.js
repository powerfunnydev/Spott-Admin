import { createStructuredSelector } from 'reselect';
import {
  agesEntitiesSelector, gendersEntitiesSelector, gendersListSelector, agesListSelector,
  createEntitiesByRelationSelector, createEntitiesByListSelector, filterHasTopMediaRelationsSelector,
  filterHasTopPeopleRelationsSelector, topMediaEntitiesSelector, topPeopleEntitiesSelector, languagesEntitiesSelector
} from '../../../selectors/data';
import { getInformationFromQuery } from '../../_common/components/table/index';
import { serializeFilterHasTopMedia, serializeFilterHasTopPeople } from '../../../reducers/utils';

// Filters
// ///////

const gendersSelector = createEntitiesByListSelector(gendersListSelector, gendersEntitiesSelector);
const agesSelector = createEntitiesByListSelector(agesListSelector, agesEntitiesSelector);

export const filtersSelector = createStructuredSelector({
  ages: agesSelector,
  agesById: agesEntitiesSelector,
  genders: gendersSelector,
  gendersById: gendersEntitiesSelector,
  languagesById: languagesEntitiesSelector
});

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
