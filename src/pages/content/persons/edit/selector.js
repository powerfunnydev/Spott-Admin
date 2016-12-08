import { createStructuredSelector } from 'reselect';
import { currentModalSelector, gendersSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  personsEntitiesSelector,
  createEntityByIdSelector,
  createEntityIdsByRelationSelector,
  searchStringHasPersonsRelationsSelector
} from '../../../../selectors/data';

const formName = 'personEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

export const currentPersonIdSelector = (state, props) => { return props.params.personId; };
export const currentPersonSelector = createEntityByIdSelector(personsEntitiesSelector, currentPersonIdSelector);

export const currentSeriesEntriesSearchStringSelector = (state) => state.getIn([ 'content', 'persons', 'edit', 'currentPersonSearchString' ]);

export const searchedPersonIdsSelector = createEntityIdsByRelationSelector(searchStringHasPersonsRelationsSelector, currentSeriesEntriesSearchStringSelector);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentPerson: currentPersonSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  genders: gendersSelector,
  supportedLocales: supportedLocalesSelector
});
