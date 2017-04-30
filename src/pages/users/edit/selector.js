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
  searchStringHasBrandsRelationsSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasContentProducersRelationsSelector,
  createEntityByIdSelector,
  listBrandsEntitiesSelector
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

export const currentBrandsSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentBrandsSearchString' ]);
export const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentBroadcastersSearchString' ]);
export const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentContentProducersSearchString' ]);
export const popUpMessageSelector = (state) => state.getIn([ 'users', 'edit', 'popUpMessage' ]);

export const searchedBrandIdsSelector = createEntityIdsByRelationSelector(searchStringHasBrandsRelationsSelector, currentBrandsSearchStringSelector);
export const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
export const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentContentProducersSearchStringSelector);
export const currentUserSelector = createEntityByIdSelector(usersEntitiesSelector, currentUserIdSelector);

export default createStructuredSelector({
  brandsById: listBrandsEntitiesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  currentEmail: currentEmailSelector,
  currentUser: currentUserSelector,
  currentUserStatus: currentUserStatusSelector,
  genders: gendersSelector,
  localeNames: localeNamesSelector,
  popUpMessage: popUpMessageSelector,
  searchedBrandIds: searchedBrandIdsSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector
});
