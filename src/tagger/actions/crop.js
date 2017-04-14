import * as api from '../api/crop';
import { makeApiActionCreator } from '../actions/_utils';

export const CROP_PERSIST_START = 'CROP/CROP_PERSIST_START';
export const CROP_PERSIST_SUCCESS = 'CROP/CROP_PERSIST_SUCCESS';
export const CROP_PERSIST_ERROR = 'CROP/CROP_PERSIST_ERROR';

export const CROPS_FETCH_START = 'CROP/CROPS_FETCH_START';
export const CROPS_FETCH_SUCCESS = 'CROP/CROPS_FETCH_SUCCESS';
export const CROPS_FETCH_ERROR = 'CROP/CROPS_FETCH_ERROR';

export const persistCrop = makeApiActionCreator(api.persistCrop, CROP_PERSIST_START, CROP_PERSIST_SUCCESS, CROP_PERSIST_ERROR);
export const fetchCrops = makeApiActionCreator(api.fetchCrops, CROPS_FETCH_START, CROPS_FETCH_SUCCESS, CROPS_FETCH_ERROR);
