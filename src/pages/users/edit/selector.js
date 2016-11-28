import { createSelector, createStructuredSelector } from 'reselect';
import {
  gendersSelector,
  localeNamesSelector
} from '../../../selectors/global';
import { getFormValues } from 'redux-form/immutable';

import {
  usersEntitiesSelector,
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  createEntityByIdSelector
} from '../../../selectors/data';

const formSelector = getFormValues('userEdit');

export const currentEmailSelector = createSelector(
  formSelector,
  (form) => (form && form.get('email'))
);

export const currentUserStatusSelector = createSelector(
  formSelector,
  (form) => (form && form.get('userStatus'))
);

export const currentUserIdSelector = (state, props) => { return props.params.id; };

export const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentBroadcastersSearchString' ]);
export const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentContentProducersSearchString' ]);
export const popUpMessageSelector = (state) => state.getIn([ 'users', 'edit', 'popUpMessage' ]);

export const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
export const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentBroadcastersSearchStringSelector);
export const currentUserSelector = createEntityByIdSelector(usersEntitiesSelector, currentUserIdSelector);

export default createStructuredSelector({
  currentUser: currentUserSelector,
  currentUserStatus: currentUserStatusSelector,
  currentEmail: currentEmailSelector,
  popUpMessage: popUpMessageSelector,
  genders: gendersSelector,
  localeNames: localeNamesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector
});
