import { makeApiActionCreator } from './utils';
import * as broadcastChannelApi from '../api/broadcastChannel';

export const BROADCAST_CHANNEL_SEARCH_START = 'DATA/BROADCAST_CHANNEL_SEARCH_START';
export const BROADCAST_CHANNEL_SEARCH_SUCCESS = 'DATA/BROADCAST_CHANNEL_SEARCH_SUCCESS';
export const BROADCAST_CHANNEL_SEARCH_ERROR = 'DATA/BROADCAST_CHANNEL_SEARCH_ERROR';

/**
 * @param {Object} params
 * @param {string} params.searchString Lowercase search string.
 */
export const searchBroadcastChannels = makeApiActionCreator(broadcastChannelApi.searchBroadcastChannels, BROADCAST_CHANNEL_SEARCH_START, BROADCAST_CHANNEL_SEARCH_SUCCESS, BROADCAST_CHANNEL_SEARCH_ERROR);
