import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listPersonsEntitiesSelector, filterHasPersonsRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasPersons } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'persons', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'persons', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'persons', 'list', 'totalResultCount' ]);

export const personsFilterKeySelector = (state, props) => serializeFilterHasPersons(props.location.query);

export const personsSelector = createEntitiesByRelationSelector(
  filterHasPersonsRelationsSelector,
  personsFilterKeySelector,
  listPersonsEntitiesSelector
);

export default createStructuredSelector({
  persons: personsSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
