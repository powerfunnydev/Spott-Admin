import { List } from 'immutable';
import { createSelector, createStructuredSelector } from 'reselect';
import {
  characterHasProductGroupsRelationsSelector, characterEntitiesSelector,
  createEntitiesByRelationSelector, currentMediumSelector, productEntitiesSelector,
  productGroupEntitiesSelector
} from '../common';
import { selectedProductIdSelector } from '.';

export const currentEditProductGroupIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'currentEditCharacterProductGroupId' ]);
export const openCharacterIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'openCharacterId' ]);

export const mediumCharactersSelector = createSelector(
  currentMediumSelector,
  characterEntitiesSelector,
  (medium, characters) => (medium && medium.get('characters') && medium.get('characters').map((rel) => characters.get(rel.get('id')))) || List()
);

export const currentCharacterSelector = createSelector(
  openCharacterIdSelector,
  characterEntitiesSelector,
  (characterId, characters) => characters.get(characterId)
);

export const productGroupsSelector = createEntitiesByRelationSelector(characterHasProductGroupsRelationsSelector, openCharacterIdSelector, productGroupEntitiesSelector);

export default createStructuredSelector({
  characters: characterEntitiesSelector,
  currentCharacter: currentCharacterSelector,
  currentEditProductGroupId: currentEditProductGroupIdSelector,
  mediumCharacters: mediumCharactersSelector,
  productGroups: productGroupsSelector,
  products: productEntitiesSelector,
  selectedProductId: selectedProductIdSelector
});
