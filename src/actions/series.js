import { makeApiActionCreator } from './utils';
import * as seriesApi from '../api/series';

export const SERIES_SEARCH_START = 'DATA/SERIES_SEARCH_START';
export const SERIES_SEARCH_SUCCESS = 'DATA/SERIES_SEARCH_SUCCESS';
export const SERIES_SEARCH_ERROR = 'DATA/SERIES_SEARCH_ERROR';

/**
 * @param {Object} params
 * @param {string} params.searchString Lowercase search string.
 */
export const searchSeries = makeApiActionCreator(seriesApi.searchSeries, SERIES_SEARCH_START, SERIES_SEARCH_SUCCESS, SERIES_SEARCH_ERROR);
