import * as seriesApi from '../api/series';
import { makeApiActionCreator } from './utils';

export const SERIES_SEARCH_START = 'DATA/SERIES_SEARCH_START';
export const SERIES_SEARCH_SUCCESS = 'DATA/SERIES_SEARCH_SUCCESS';
export const SERIES_SEARCH_ERROR = 'DATA/SERIES_SEARCH_ERROR';

export const searchSeries = makeApiActionCreator(seriesApi.searchSeries, SERIES_SEARCH_START, SERIES_SEARCH_SUCCESS, SERIES_SEARCH_ERROR);
