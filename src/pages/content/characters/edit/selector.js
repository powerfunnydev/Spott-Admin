import { createStructuredSelector } from 'reselect';
import { currentModalSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  actorsEntitiesSelector,
  charactersEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  searchStringHasActorsRelationsSelector
} from '../../../../selectors/data';

const formName = 'characterEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

export const currentCharacterIdSelector = (state, props) => { return props.params.characterId; };
export const currentCharacterSelector = createEntityByIdSelector(charactersEntitiesSelector, currentCharacterIdSelector);

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'characters', 'edit', 'currentActorSearchString' ]);

export const searchedActorIdsSelector = createEntityIdsByRelationSelector(searchStringHasActorsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  actorsById: actorsEntitiesSelector,
  _activeLocale: _activeLocaleSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  currentModal: currentModalSelector,
  currentCharacter: currentCharacterSelector,
  searchedActorIds: searchedActorIdsSelector,
  supportedLocales: supportedLocalesSelector
});
