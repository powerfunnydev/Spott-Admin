import { createStructuredSelector } from 'reselect';
import {
  charactersEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentCharacterIdSelector = (state, props) => { return props.params.characterId; };

export const currentCharacterSelector = createEntityByIdSelector(charactersEntitiesSelector, currentCharacterIdSelector);

export default createStructuredSelector({
  currentCharacter: currentCharacterSelector
});
