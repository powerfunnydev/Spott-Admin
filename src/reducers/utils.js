/* eslint-disable no-return-assign */
import { fromJS, List, Map } from 'immutable';
import { FETCHING, UPDATING, ERROR, LOADED } from '../constants/statusTypes';

/**
 * uniqueKey is used to distinguish multiple tables with the same queries, but different key.
 * example: global users with searchString='abc' aren't the same as users of
 * a broadcaster with the same searchString.
 */
export function serialize ({ searchString = '', page = 0, pageSize = 25, sortDirection, sortField }, uniqueKey) {
  let id = `uniqueKey=${uniqueKey}&page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    id = id.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  return id;
}

export const serializeFilterHasContentProducers = serialize;
export const serializeFilterHasBroadcasters = serialize;
export const serializeFilterHasBroadcastChannels = serialize;
export const serializeFilterHasUsers = serialize;
export const serializeFilterHasSeriesEntries = serialize;
export const serializeFilterHasSeasons = serialize;
export const serializeFilterHasCharacters = serialize;
export const serializeFilterHasProducts = serialize;

export function serializeFilterHasTvGuideEntries ({ page = 0, pageSize = 25, sortDirection, sortField, mediumId }) {
  let id = `mediumId=${mediumId}&page=${page}&pageSize=${pageSize}`;
  if (sortDirection && sortField && (sortDirection === 'ASC' || sortDirection === 'DESC')) {
    id = id.concat(`&sortField=${sortField}&sortDirection=${sortDirection}`);
  }
  return id;
}

export function serializeFilterHasEpisodes ({ searchString = '', seasonId = '' }) {
  return `searchString=${searchString}&seasonId=${seasonId}`;
}

export function serializeFilterHasSeries ({ searchString = '', seriesEntryId = '' }) {
  return `searchString=${searchString}&seriesEntryId=${seriesEntryId}`;
}

// path is e.g., [ 'relations', type, id ]
export function fetchStart (state, path) {
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

export function fetchSuccess (state, path, data) {
  return state.setIn(path, fromJS({ ...data, _error: null, _status: LOADED }));
}

export function fetchError (state, path, error) {
  return state.setIn(path, Map({ _error: error, _status: ERROR }));
}

export function searchStart (state, relationsKey, key) {
  return fetchStart(state, [ 'relations', relationsKey, key ]);
}

export function searchSuccess (state, entitiesKey, relationsKey, key, data) {
  data.forEach((item) => item._status = LOADED); // Add _status 'loaded' to each fetched entity.
  return state
    .mergeIn([ 'entities', entitiesKey ], fromJS(data.reduce((accumulator, next) => {
      accumulator[next.id] = next;
      return accumulator;
    }, {})))
    .setIn([ 'relations', relationsKey, key ],
      Map({ _status: LOADED, data: List(data.map((item) => item.id)) }));
}

export function searchError (state, relationsKey, key, error) {
  return fetchError(state, [ 'relations', relationsKey, key ], error);
}

export function fetchListStart (state, listKey) {
  return fetchStart(state, [ 'lists', listKey ]);
}

export function fetchListSuccess (state, listKey, entitiesKey, data) {
  // data.forEach((item) => item._status = LOADED); // Add _status 'loaded' to each fetched entity.
  return state
    .mergeDeepIn([ 'entities', entitiesKey ], fromJS(data.reduce((accumulator, next) => {
      next._status = LOADED;
      next._error = null;
      accumulator[next.id] = next;
      return accumulator;
    }, {})))
    .setIn([ 'lists', listKey ],
      Map({ _status: LOADED, data: List(data.map((item) => item.id)) }));
}
export function fetchListError (state, listKey, error) {
  return fetchError(state, [ 'lists', listKey ], error);
}
