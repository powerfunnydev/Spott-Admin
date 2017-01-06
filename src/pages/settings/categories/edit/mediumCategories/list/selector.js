import { createStructuredSelector } from 'reselect';
import {
  createEntitiesByRelationSelector,
  filterHasMediumCategoriesRelationsSelector,
  listMediumCategoriesEntitiesSelector
} from '../../../../../../selectors/data';
import { serializeFilterHasMediumCategories } from '../../../../../../reducers/utils';

export const mediumCategoriesFilterKeySelector = (state, props) => { return serializeFilterHasMediumCategories({}); };

export const mediumCategoriesSelector = createEntitiesByRelationSelector(
  filterHasMediumCategoriesRelationsSelector,
  mediumCategoriesFilterKeySelector,
  listMediumCategoriesEntitiesSelector
);
export default createStructuredSelector({
  mediumCategories: mediumCategoriesSelector
});
