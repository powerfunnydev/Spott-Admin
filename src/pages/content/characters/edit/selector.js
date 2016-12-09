import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  listPersonsEntitiesSelector,
  charactersEntitiesSelector,
  characterHasFaceImagesRelationsSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  createEntitiesByRelationSelector,
  faceImagesEntitiesSelector,
  searchStringHasPersonsRelationsSelector
} from '../../../../selectors/data';

const formName = 'characterEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentCharacterIdSelector = (state, props) => { return props.params.characterId; };
const currentCharacterSelector = createEntityByIdSelector(charactersEntitiesSelector, currentCharacterIdSelector);

const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'characters', 'edit', 'currentPersonSearchString' ]);

const searchedPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentSeriesEntriesSearchStringSelector);
const faceImagesSelector = createEntitiesByRelationSelector(characterHasFaceImagesRelationsSelector, currentCharacterIdSelector, faceImagesEntitiesSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentCharacter: currentCharacterSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  faceImages: faceImagesSelector,
  personsById: listPersonsEntitiesSelector,
  searchedPersonIds: searchedPersonIdsSelector,
  supportedLocales: supportedLocalesSelector
});
