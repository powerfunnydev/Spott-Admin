import { createSelector, createStructuredSelector } from 'reselect';
import {
  gendersSelector,
  localeNamesSelector
} from '../../../selectors/global';
import { getFormValues } from 'redux-form/immutable';

import {
  broadcastersEntitiesSelector,
  contentProducersEntitiesSelector,
  createEntityIdsByRelationSelector,
  searchStringHasBroadcastersRelationsSelector,
  searchStringHasContentProducersRelationsSelector
} from '../../../selectors/data';

const formSelector = getFormValues('userEdit');

export const currentEmailSelector = createSelector(
  formSelector,
  (form) => (form && form.get('email'))
);

export const currentBroadcastersSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentBroadcastersSearchString' ]);
export const currentContentProducersSearchStringSelector = (state) => state.getIn([ 'users', 'edit', 'currentContentProducersSearchString' ]);
export const popUpMessageSelector = (state) => state.getIn([ 'users', 'edit', 'popUpMessage' ]);

export const searchedBroadcasterIdsSelector = createEntityIdsByRelationSelector(searchStringHasBroadcastersRelationsSelector, currentBroadcastersSearchStringSelector);
export const searchedContentProducerIdsSelector = createEntityIdsByRelationSelector(searchStringHasContentProducersRelationsSelector, currentBroadcastersSearchStringSelector);

export default createStructuredSelector({
  currentEmail: currentEmailSelector,
  popUpMessage: popUpMessageSelector,
  genders: gendersSelector,
  localeNames: localeNamesSelector,
  broadcastersById: broadcastersEntitiesSelector,
  contentProducersById: contentProducersEntitiesSelector,
  searchedBroadcasterIds: searchedBroadcasterIdsSelector,
  searchedContentProducerIds: searchedContentProducerIdsSelector
});
