import { makeApiActionCreator } from './utils';
import * as api from '../api/topic';

export const TOPICS_SEARCH_START = 'TOPIC/TOPICS_SEARCH_START';
export const TOPICS_SEARCH_SUCCESS = 'TOPIC/TOPICS_SEARCH_SUCCESS';
export const TOPICS_SEARCH_ERROR = 'TOPIC/TOPICS_SEARCH_ERROR';

export const searchTopics = makeApiActionCreator(api.searchTopics, TOPICS_SEARCH_START, TOPICS_SEARCH_SUCCESS, TOPICS_SEARCH_ERROR);
