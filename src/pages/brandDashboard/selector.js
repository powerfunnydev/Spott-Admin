import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, topMediaEntitiesSelector, filterHasTopMediaRelationsSelector } from '../../selectors/data';
import { getInformationFromQuery } from '../_common/components/table/index';
import { serializeFilterHasTopMedia } from '../../reducers/utils';

export const topMediaPrefix = 'topMedia';

const topMediaFilterKeySelector = (state, props) => serializeFilterHasTopMedia({
  ...getInformationFromQuery(props.location.query, topMediaPrefix)
  // brandId: 'BRAND_ID_PLACEHOLDER'
});

export const topMediaSelector = createEntitiesByRelationSelector(
  filterHasTopMediaRelationsSelector,
  topMediaFilterKeySelector,
  topMediaEntitiesSelector
);

export default createStructuredSelector({
  topMedia: topMediaSelector
});
