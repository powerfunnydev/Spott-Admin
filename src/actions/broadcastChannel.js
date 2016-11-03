import { makeApiActionCreator } from './utils';
import * as broadcastChannelApi from '../api/broadcastChannel';

export const BROADCAST_CHANNEL_UPLOAD_IMAGE_START = 'DATA/BROADCAST_CHANNEL_UPLOAD_IMAGE_START';
export const BROADCAST_CHANNEL_UPLOAD_IMAGE_SUCCESS = 'DATA/BROADCAST_CHANNEL_UPLOAD_IMAGE_SUCCESS';
export const BROADCAST_CHANNEL_UPLOAD_IMAGE_ERROR = 'DATA/BROADCAST_CHANNEL_UPLOAD_IMAGE_ERROR';

export const BROADCAST_CHANNEL_SEARCH_START = 'DATA/BROADCAST_CHANNEL_SEARCH_START';
export const BROADCAST_CHANNEL_SEARCH_SUCCESS = 'DATA/BROADCAST_CHANNEL_SEARCH_SUCCESS';
export const BROADCAST_CHANNEL_SEARCH_ERROR = 'DATA/BROADCAST_CHANNEL_SEARCH_ERROR';

export const BROADCAST_CHANNELS_FETCH_START = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_FETCH_START';
export const BROADCAST_CHANNELS_FETCH_SUCCESS = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_FETCH_SUCCESS';
export const BROADCAST_CHANNELS_FETCH_ERROR = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_FETCH_ERROR';

export const BROADCAST_CHANNELS_ENTRY_FETCH_START = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_FETCH_START';
export const BROADCAST_CHANNELS_ENTRY_FETCH_SUCCESS = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_FETCH_SUCCESS';
export const BROADCAST_CHANNELS_ENTRY_FETCH_ERROR = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_FETCH_ERROR';

export const BROADCAST_CHANNELS_ENTRY_PERSIST_START = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_PERSIST_START';
export const BROADCAST_CHANNELS_ENTRY_PERSIST_SUCCESS = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_PERSIST_SUCCESS';
export const BROADCAST_CHANNELS_ENTRY_PERSIST_ERROR = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_PERSIST_ERROR';

export const BROADCAST_CHANNELS_ENTRY_DELETE_START = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_DELETE_START';
export const BROADCAST_CHANNELS_ENTRY_DELETE_SUCCESS = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_DELETE_SUCCESS';
export const BROADCAST_CHANNELS_ENTRY_DELETE_ERROR = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRY_DELETE_ERROR';

export const BROADCAST_CHANNELS_ENTRIES_DELETE_START = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRIES_DELETE_START';
export const BROADCAST_CHANNELS_ENTRIES_DELETE_SUCCESS = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRIES_DELETE_SUCCESS';
export const BROADCAST_CHANNELS_ENTRIES_DELETE_ERROR = 'BROADCAST_CHANNELS/BROADCAST_CHANNELS_ENTRIES_DELETE_ERROR';

export const fetchBroadcastChannels = makeApiActionCreator(broadcastChannelApi.fetchBroadcastChannels, BROADCAST_CHANNELS_FETCH_START, BROADCAST_CHANNELS_FETCH_SUCCESS, BROADCAST_CHANNELS_FETCH_ERROR);
export const fetchBroadcastChannelEntry = makeApiActionCreator(broadcastChannelApi.fetchBroadcastChannelEntry, BROADCAST_CHANNELS_ENTRY_FETCH_START, BROADCAST_CHANNELS_ENTRY_FETCH_SUCCESS, BROADCAST_CHANNELS_ENTRY_FETCH_ERROR);
export const persistBroadcastChannelEntry = makeApiActionCreator(broadcastChannelApi.persistBroadcastChannel, BROADCAST_CHANNELS_ENTRY_PERSIST_START, BROADCAST_CHANNELS_ENTRY_PERSIST_SUCCESS, BROADCAST_CHANNELS_ENTRY_PERSIST_ERROR);
export const deleteBroadcastChannelEntries = makeApiActionCreator(broadcastChannelApi.deleteBroadcastChannelEntries, BROADCAST_CHANNELS_ENTRIES_DELETE_START, BROADCAST_CHANNELS_ENTRIES_DELETE_SUCCESS, BROADCAST_CHANNELS_ENTRIES_DELETE_ERROR);
export const deleteBroadcastChannelEntry = makeApiActionCreator(broadcastChannelApi.deleteBroadcastChannelEntry, BROADCAST_CHANNELS_ENTRY_DELETE_START, BROADCAST_CHANNELS_ENTRY_DELETE_SUCCESS, BROADCAST_CHANNELS_ENTRY_DELETE_ERROR);
export const searchBroadcastChannels = makeApiActionCreator(broadcastChannelApi.searchBroadcastChannels, BROADCAST_CHANNEL_SEARCH_START, BROADCAST_CHANNEL_SEARCH_SUCCESS, BROADCAST_CHANNEL_SEARCH_ERROR);
export const uploadBroadcastChannelImage = makeApiActionCreator(broadcastChannelApi.uploadBroadcastChannelImage, BROADCAST_CHANNEL_UPLOAD_IMAGE_START, BROADCAST_CHANNEL_UPLOAD_IMAGE_SUCCESS, BROADCAST_CHANNEL_UPLOAD_IMAGE_ERROR);