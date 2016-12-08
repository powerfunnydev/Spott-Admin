import { createStructuredSelector } from 'reselect';
import {
  personsEntitiesSelector,
  createEntityByIdSelector
} from '../../../../selectors/data';

export const currentPersonIdSelector = (state, props) => { return props.params.personId; };

export const currentPersonSelector = createEntityByIdSelector(personsEntitiesSelector, currentPersonIdSelector);

export default createStructuredSelector({
  currentPerson: currentPersonSelector
});
