import { fromJS, List, Map } from 'immutable';
import * as mediaActions from '../actions/media';
import { FETCHING, UPDATING, ERROR, LOADED } from '../constants/statusTypes';

// path is e.g., [ 'relations', type, id ]
function fetchStart (state, path) {
  // Get the data (entity/relations) from the state, which can be undefined.
  const data = state.getIn(path);
  // The data is already fetched if the data exist and there is no status.
  const loaded = data && data.get('_status') === LOADED;
  // When the data is already present, set it's status to 'updating'.
  // This way we now if there is already data, but it's updating.
  if (loaded) {
    return state.mergeIn(path, { _status: UPDATING });
  }
  // If the data do not exist, set the status to 'fetching'.
  return state.mergeIn(path, { _status: FETCHING });
}

function fetchSuccess (state, path, data) {
  return state.setIn(path, fromJS({ ...data, _status: LOADED }));
}

function fetchError (state, path, error) {
  return state.setIn(path, Map({ _error: error, _status: ERROR }));
}

function searchStart (state, relationsKey, key) {
  return fetchStart(state, [ 'relations', relationsKey, key ]);
}

function searchSuccess (state, entitiesKey, relationsKey, key, data) {
  data.forEach((item) => item._status = LOADED); // Add _status 'loaded' to each fetched entity.
  return state
    .mergeIn([ 'entities', entitiesKey ], fromJS(data.reduce((accumulator, next) => {
      accumulator[next.id] = next;
      return accumulator;
    }, {})))
    .setIn([ 'relations', relationsKey, key ],
      Map({ _status: LOADED, data: List(data.map((item) => item.id)) }));
}

function searchError (state, relationsKey, key, error) {
  return fetchError(state, [ 'relations', relationsKey, key ], error);
}

export default (state = fromJS({
  entities: {
    media: {}
  },
  relations: {
    searchStringHasMedia: {}
  }
}), action) => {
  switch (action.type) {
    case mediaActions.MEDIA_SEARCH_START:
      return searchStart(state, 'searchStringHasMedia', action.searchString);
    case mediaActions.MEDIA_SEARCH_SUCCESS:
      return searchSuccess(state, 'media', 'searchStringHasMedia', action.searchString, action.data);
    case mediaActions.MEDIA_SEARCH_ERROR:
      return searchError(state, 'searchStringHasMedia', action.searchString, action.error);
    default:
      return state;
  }
};
