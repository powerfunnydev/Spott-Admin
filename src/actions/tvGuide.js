import * as api from '../api/tvGuide';
import { makeApiActionCreator } from './utils';

export const TV_GUIDE_FETCH_START = 'TV_GUIDE/TV_GUIDE_FETCH_START';
export const TV_GUIDE_FETCH_SUCCESS = 'TV_GUIDE/TV_GUIDE_FETCH_SUCCESS';
export const TV_GUIDE_FETCH_ERROR = 'TV_GUIDE/TV_GUIDE_FETCH_ERROR';

export const fetchTvGuide = makeApiActionCreator(api.fetchTvGuide, TV_GUIDE_FETCH_START, TV_GUIDE_FETCH_SUCCESS, TV_GUIDE_FETCH_ERROR);
