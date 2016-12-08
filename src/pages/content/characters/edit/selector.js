import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  personsEntitiesSelector,
  charactersEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  searchStringHasPersonsRelationsSelector
} from '../../../../selectors/data';

const formName = 'characterEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

export const currentCharacterIdSelector = (state, props) => { return props.params.characterId; };
export const currentCharacterSelector = createEntityByIdSelector(charactersEntitiesSelector, currentCharacterIdSelector);

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'characters', 'edit', 'currentPersonSearchString' ]);

export const searchedPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  personsById: personsEntitiesSelector,
  _activeLocale: _activeLocaleSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  currentModal: currentModalSelector,
  currentCharacter: currentCharacterSelector,
  searchedPersonIds: searchedPersonIdsSelector,
  supportedLocales: supportedLocalesSelector
});
