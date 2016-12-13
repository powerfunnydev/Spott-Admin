import { createSelector, createStructuredSelector } from 'reselect';
import {
  characterEntitiesSelector, productEntitiesSelector
} from '../common';
import { CHARACTER_QUICKY, PRODUCT_QUICKY } from '../../constants/itemTypes';
import { selectedProductIdSelector } from '.';

export const charactersSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'characters' ]);
export const currentCharacterIdSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'currentCharacterId' ]);
export const quickiesListSelector = (state) => state.getIn([ 'tagger', 'tagger', 'quickies', 'quickies' ]);

export const currentCharacterSelector = createSelector(
  currentCharacterIdSelector,
  characterEntitiesSelector,
  (characterId, characters) => characters.get(characterId)
);

export const characterListSelector = createSelector(
  charactersSelector,
  characterEntitiesSelector,
  (characterIds, characters) => characterIds.map((id) => characters.get(id))
);

export const latestQuickiesSelector = createSelector(
  currentCharacterIdSelector,
  quickiesListSelector,
  characterEntitiesSelector,
  productEntitiesSelector,
  (currentCharacterId, quickiesList, characters, products) => {
    return quickiesList.filter((quicky) => (
      !currentCharacterId || (quicky.get('type') === PRODUCT_QUICKY && quicky.get('characterId') === currentCharacterId)
    )).map((quicky) => {
      switch (quicky.get('type')) {
        case CHARACTER_QUICKY: // Map({ character, characterId, type: CHARACTER_QUICKY })
          return quicky.set('character', characters.get(quicky.get('characterId')));
        case PRODUCT_QUICKY: // Map({ characterId, markerHidden, productId, relevance, type: PRODUCT_QUICKY })
          return quicky.set('product', products.get(quicky.get('productId')));
        default:
          console.error('quickiesSelector: Unknown quickies type: ', quicky.toJS());
      }
    });
  }
);

export default createStructuredSelector({
  characters: characterEntitiesSelector,
  characterList: characterListSelector,
  currentCharacter: currentCharacterSelector,
  products: productEntitiesSelector,
  quickies: latestQuickiesSelector,
  selectedProductId: selectedProductIdSelector
});
