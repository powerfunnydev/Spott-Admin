import { makeApiActionCreator } from './utils';
import * as brandDashbiardApi from '../api/brandDashboard';

export const TOP_MEDIA_FETCH_START = 'DATA_BRAND_DASHBOARD/TOP_MEDIA_FETCH_START';
export const TOP_MEDIA_FETCH_SUCCESS = 'DATA_BRAND_DASHBOARD/TOP_MEDIA_FETCH_SUCCESS';
export const TOP_MEDIA_FETCH_ERROR = 'DATA_BRAND_DASHBOARD/TOP_MEDIA_FETCH_ERROR';

export const fetchTopMedia = makeApiActionCreator(brandDashbiardApi.fetchTopMedia, TOP_MEDIA_FETCH_START, TOP_MEDIA_FETCH_SUCCESS, TOP_MEDIA_FETCH_ERROR);
