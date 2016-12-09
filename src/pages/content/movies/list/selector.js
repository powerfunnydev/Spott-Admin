import { createStructuredSelector } from 'reselect';
import { createEntitiesByRelationSelector, listCharactersEntitiesSelector, filterHasCharactersRelationsSelector } from '../../../../selectors/data';
import { serializeFilterHasCharacters } from '../../../../../src/reducers/utils';

export const isSelectedSelector = (state) => state.getIn([ 'content', 'characters', 'list', 'isSelected' ]);
export const pageCountSelector = (state) => state.getIn([ 'content', 'characters', 'list', 'pageCount' ]);
export const totalResultCountSelector = (state) => state.getIn([ 'content', 'characters', 'list', 'totalResultCount' ]);

export const charactersFilterKeySelector = (state, props) => serializeFilterHasCharacters(props.location.query);

export const charactersSelector = createEntitiesByRelationSelector(
  filterHasCharactersRelationsSelector,
  charactersFilterKeySelector,
  listCharactersEntitiesSelector
);

export default createStructuredSelector({
  characters: charactersSelector,
  isSelected: isSelectedSelector,
  pageCount: pageCountSelector,
  totalResultCount: totalResultCountSelector
});
