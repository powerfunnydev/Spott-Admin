import { Map } from 'immutable';
import { LOAD } from './actions';

export default (state = Map({}), action) => {
  switch (action.type) {
    case LOAD:
      return state.set('broadcastersEntryId', action.broadcastersEntryId);
    default:
      return state;
  }
};
