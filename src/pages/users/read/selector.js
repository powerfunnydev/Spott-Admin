import { createStructuredSelector } from 'reselect';
import {
  usersEntitiesSelector,
  createEntityByIdSelector
} from '../../../selectors/data';

export const currentUserIdSelector = (state, props) => { return props.params.id; };

export const currentUserSelector = createEntityByIdSelector(usersEntitiesSelector, currentUserIdSelector);

export default createStructuredSelector({
  currentUser: currentUserSelector
});
