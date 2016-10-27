import { makeApiActionCreator } from './utils';
import * as epsiodeApi from '../api/episode';

export const EPISODES_SEARCH_START = 'DATA/EPISODES_SEARCH_START';
export const EPISODES_SEARCH_SUCCESS = 'DATA/EPISODES_SEARCH_SUCCESS';
export const EPISODES_SEARCH_ERROR = 'DATA/EPISODES_SEARCH_ERROR';

/**
 * @param {Object} params
 * @param {string} params.searchString Lowercase search string.
 */
export const searchEpisodes = makeApiActionCreator(epsiodeApi.searchEpisodes, EPISODES_SEARCH_START, EPISODES_SEARCH_SUCCESS, EPISODES_SEARCH_ERROR);
