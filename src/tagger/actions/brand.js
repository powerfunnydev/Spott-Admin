import { BRAND_FETCH_START, BRAND_FETCH_SUCCESS, BRAND_FETCH_ERROR } from '../constants/actionTypes';
import { makeApiActionCreator } from '../actions/_utils';
import * as brandApi from '../api/brand';

export const fetchBrand = makeApiActionCreator(brandApi.getBrand, BRAND_FETCH_START, BRAND_FETCH_SUCCESS, BRAND_FETCH_ERROR);
