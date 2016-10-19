import { makeApiActionCreator } from './utils';
import * as seasonsApi from '../api/season';

export const SEASONS_SEARCH_START = 'DATA/SEASONS_SEARCH_START';
export const SEASONS_SEARCH_SUCCESS = 'DATA/SEASONS_SEARCH_SUCCESS';
export const SEASONS_SEARCH_ERROR = 'DATA/SEASONS_SEARCH_ERROR';

/**
 * @param {Object} params
 * @param {string} params.searchString Lowercase search string.
 */
export const searchSeasons = makeApiActionCreator(seasonsApi.searchSeasons, SEASONS_SEARCH_START, SEASONS_SEARCH_SUCCESS, SEASONS_SEARCH_ERROR);
