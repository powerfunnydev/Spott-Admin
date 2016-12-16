import { createStructuredSelector } from 'reselect';
import { currentModalSelector, gendersSelector } from '../../../../selectors/global';
import { createFormValueSelector } from '../../../../utils';
import {
  personsEntitiesSelector,
  createEntityByIdSelector,
  createEntitiesByRelationSelector,
  faceImagesEntitiesSelector,
  personHasFaceImagesRelationsSelector
} from '../../../../selectors/data';

const formName = 'personEdit';
const formErrorsSelector = (state) => { return state.getIn([ 'form', formName, 'syncErrors' ]); };

const valuesSelector = (state) => state.getIn([ 'form', formName, 'values' ]);
const currentDefaultLocaleSelector = createFormValueSelector(formName, 'defaultLocale');
const _activeLocaleSelector = createFormValueSelector(formName, '_activeLocale');
const supportedLocalesSelector = createFormValueSelector(formName, 'locales');

const currentPersonIdSelector = (state, props) => { return props.params.personId; };
const currentPersonSelector = createEntityByIdSelector(personsEntitiesSelector, currentPersonIdSelector);

const faceImagesSelector = createEntitiesByRelationSelector(personHasFaceImagesRelationsSelector, currentPersonIdSelector, faceImagesEntitiesSelector);

const popUpMessageSelector = (state) => state.getIn([ 'content', 'persons', 'edit', 'popUpMessage' ]);

export default createStructuredSelector({
  _activeLocale: _activeLocaleSelector,
  currentModal: currentModalSelector,
  currentPerson: currentPersonSelector,
  defaultLocale: currentDefaultLocaleSelector,
  errors: formErrorsSelector,
  faceImages: faceImagesSelector,
  formValues: valuesSelector,
  genders: gendersSelector,
  popUpMessage: popUpMessageSelector,
  supportedLocales: supportedLocalesSelector
});
