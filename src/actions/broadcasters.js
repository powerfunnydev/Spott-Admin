import * as api from '../api/broadcasters';
import { makeApiActionCreator } from './utils';

export const BROADCASTERS_FETCH_START = 'BROADCASTERS/BROADCASTERS_FETCH_START';
export const BROADCASTERS_FETCH_SUCCESS = 'BROADCASTERS/BROADCASTERS_FETCH_SUCCESS';
export const BROADCASTERS_FETCH_ERROR = 'BROADCASTERS/BROADCASTERS_FETCH_ERROR';

export const BROADCASTERS_ENTRY_FETCH_START = 'BROADCASTERS/BROADCASTERS_ENTRY_FETCH_START';
export const BROADCASTERS_ENTRY_FETCH_SUCCESS = 'BROADCASTERS/BROADCASTERS_ENTRY_FETCH_SUCCESS';
export const BROADCASTERS_ENTRY_FETCH_ERROR = 'BROADCASTERS/BROADCASTERS_ENTRY_FETCH_ERROR';

export const BROADCASTER_CHANNELS_FETCH_START = 'BROADCASTERS/BROADCASTER_CHANNELS_FETCH_START';
export const BROADCASTER_CHANNELS_FETCH_SUCCESS = 'BROADCASTERS/BROADCASTER_CHANNELS_FETCH_SUCCESS';
export const BROADCASTER_CHANNELS_FETCH_ERROR = 'BROADCASTERS/BROADCASTER_CHANNELS_FETCH_ERROR';

export const BROADCASTERS_ENTRY_PERSIST_START = 'BROADCASTERS/BROADCASTERS_ENTRY_PERSIST_START';
export const BROADCASTERS_ENTRY_PERSIST_SUCCESS = 'BROADCASTERS/BROADCASTERS_ENTRY_PERSIST_SUCCESS';
export const BROADCASTERS_ENTRY_PERSIST_ERROR = 'BROADCASTERS/BROADCASTERS_ENTRY_PERSIST_ERROR';

export const BROADCASTERS_ENTRY_DELETE_START = 'BROADCASTERS/BROADCASTERS_ENTRY_DELETE_START';
export const BROADCASTERS_ENTRY_DELETE_SUCCESS = 'BROADCASTERS/BROADCASTERS_ENTRY_DELETE_SUCCESS';
export const BROADCASTERS_ENTRY_DELETE_ERROR = 'BROADCASTERS/BROADCASTERS_ENTRY_DELETE_ERROR';

export const BROADCASTERS_ENTRIES_DELETE_START = 'BROADCASTERS/BROADCASTERS_ENTRIES_DELETE_START';
export const BROADCASTERS_ENTRIES_DELETE_SUCCESS = 'BROADCASTERS/BROADCASTERS_ENTRIES_DELETE_SUCCESS';
export const BROADCASTERS_ENTRIES_DELETE_ERROR = 'BROADCASTERS/BROADCASTERS_ENTRIES_DELETE_ERROR';

export const BROADCASTERS_SEARCH_START = 'BROADCASTERS/BROADCASTERS_SEARCH_START';
export const BROADCASTERS_SEARCH_SUCCESS = 'BROADCASTERS/BROADCASTERS_SEARCH_SUCCESS';
export const BROADCASTERS_SEARCH_ERROR = 'BROADCASTERS/BROADCASTERS_SEARCH_ERROR';

export const fetchBroadcasters = makeApiActionCreator(api.fetchBroadcasters, BROADCASTERS_FETCH_START, BROADCASTERS_FETCH_SUCCESS, BROADCASTERS_FETCH_ERROR);
export const fetchBroadcastersEntry = makeApiActionCreator(api.fetchBroadcasterEntry, BROADCASTERS_ENTRY_FETCH_START, BROADCASTERS_ENTRY_FETCH_SUCCESS, BROADCASTERS_ENTRY_FETCH_ERROR);
export const fetchBroadcasterChannels = makeApiActionCreator(api.fetchBroadcasterChannels, BROADCASTER_CHANNELS_FETCH_START, BROADCASTER_CHANNELS_FETCH_SUCCESS, BROADCASTER_CHANNELS_FETCH_ERROR);
export const persistBroadcastersEntry = makeApiActionCreator(api.persistBroadcaster, BROADCASTERS_ENTRY_PERSIST_START, BROADCASTERS_ENTRY_PERSIST_SUCCESS, BROADCASTERS_ENTRY_PERSIST_ERROR);
export const deleteBroadcastersEntries = makeApiActionCreator(api.deleteBroadcasterEntries, BROADCASTERS_ENTRIES_DELETE_START, BROADCASTERS_ENTRIES_DELETE_SUCCESS, BROADCASTERS_ENTRIES_DELETE_ERROR);
export const deleteBroadcastersEntry = makeApiActionCreator(api.deleteBroadcasterEntry, BROADCASTERS_ENTRY_DELETE_START, BROADCASTERS_ENTRY_DELETE_SUCCESS, BROADCASTERS_ENTRY_DELETE_ERROR);
export const searchBroadcasters = makeApiActionCreator(api.searchBroadcasters, BROADCASTERS_SEARCH_START, BROADCASTERS_SEARCH_SUCCESS, BROADCASTERS_SEARCH_ERROR);