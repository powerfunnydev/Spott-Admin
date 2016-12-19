import * as api from '../api/brand';
import { makeApiActionCreator } from './utils';

export const BRAND_SEARCH_START = 'BRAND/BRAND_SEARCH_START';
export const BRAND_SEARCH_SUCCESS = 'BRAND/BRAND_SEARCH_SUCCESS';
export const BRAND_SEARCH_ERROR = 'BRAND/BRAND_SEARCH_ERROR';

export const searchBrands = makeApiActionCreator(api.searchBrands, BRAND_SEARCH_START, BRAND_SEARCH_SUCCESS, BRAND_SEARCH_ERROR);
